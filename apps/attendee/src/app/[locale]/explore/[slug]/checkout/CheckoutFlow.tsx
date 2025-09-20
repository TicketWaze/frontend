'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import BackButton from '@workspace/ui/components/BackButton'
import { useTranslations } from 'next-intl'
import { AddCircle, ArrowLeft2, ArrowRight2, Card, InfoCircle, MinusCirlce } from 'iconsax-react'
import { ButtonPrimary } from '@workspace/ui/components/buttons'
import Event from '@/types/Event'
import Ticket from '@/types/Ticket'
import EventTicketType from '@/types/EventTicketType'
import Capitalize from '@workspace/ui/lib/Capitalize'
import Image from 'next/image'
import ticketBG from "./ticket-bg.svg"
import z from 'zod'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import ToggleIcon from '@workspace/ui/components/ToggleIcon'
import { Input } from '@workspace/ui/components/Inputs'
import moncash from "./moncash.svg"
import PageLoader from '@/components/Loaders/PageLoader'
import User from '@/types/User'
import { FreeEventTicket } from '@/actions/paymentActions'
import { useRouter } from '@/i18n/navigation'
import Slugify from '@/lib/Slugify'

export default function CheckoutFlow({ event, tickets, ticketTypes, user }: { event: Event, tickets: Ticket[]; ticketTypes: EventTicketType[]; user: User }) {
  const t = useTranslations('Checkout')
  const isFree = event.eventTicketTypes[0].ticketTypePrice == 0


  const attendeeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email required"),
  });

  const ticketSchema = z.object({
    ticketTypeId: z.string(),
    quantity: z.number().min(0, "Select at least 0"),
    attendees: z.array(attendeeSchema).optional(), // Changed to array of attendees
  });

  // Create a dynamic schema based on current step
  const createCheckoutSchema = (step: number, selectedTickets: any[]) => {
    if (step === 0) {
      // Step 0: Only validate that at least one ticket is selected
      return z.object({
        tickets: z
          .array(ticketSchema)
          .refine(
            (tickets) => tickets.some((t) => t.quantity > 0),
            {
              message: "Please select at least one ticket",
              path: ["tickets"],
            }
          ),
      });
    } else if (step === 1) {
      // Step 1: Validate attendee info for selected tickets
      return z.object({
        tickets: z.array(
          z.object({
            ticketTypeId: z.string(),
            quantity: z.number(),
            attendee: z.union([
              z.undefined(),
              attendeeSchema
            ])
          })
        ).refine((tickets) => {
          // Only validate attendee info for tickets with quantity > 0
          const selectedTickets = tickets.filter(t => t.quantity > 0);
          return selectedTickets.every(ticket =>
            ticket.attendee &&
            ticket.attendee.name &&
            ticket.attendee.email
          );
        }, {
          message: "Please fill in attendee information for all selected tickets",
          path: ["tickets"]
        })
      });
    } else {
      // Step 2: Payment validation (if needed)
      return z.object({
        tickets: z.array(ticketSchema),
      });
    }
  };

  const [currentStep, setCurrentStep] = useState(0)
  const [previousStep, setPreviousStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)


  const { control, handleSubmit, register, trigger, watch, formState, setValue, getValues } =
    useForm<any>({
      mode: 'onChange',
      defaultValues: {
        tickets: ticketTypes.map((ticket) => ({
          ticketTypeId: ticket.eventTicketTypeId,
          quantity: 0,
          attendees: [], // Changed to empty array
        })),
      },
    });

  const { fields } = useFieldArray({
    control,
    name: "tickets",
  });

  useEffect(() => {
    if (isFree) {
      setValue(`tickets.0.quantity`, 1, { shouldValidate: true });
    }
  }, [])

  const delta = currentStep - previousStep

  const prev = () => {
    if (isFree && currentStep === 2) {
      setCurrentStep(0)
      return
    }
    if (currentStep > 0) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step - 1)
    }
  }

  const processForm: SubmitHandler<any> = async data => {
    console.log(data);
    // Handle final form submission
  }

  const next = async () => {
    const values = getValues();
    const selectedTickets = values.tickets.filter((t: any) => t.quantity > 0);

    // Validate current step
    if (currentStep === 0) {
      // Step 0: Check if at least one ticket is selected
      if (selectedTickets.length === 0) {
        toast.error(t('ticket.error') || "Please select at least one ticket");
        return;
      }
    }
    // else if (currentStep === 1) {
    //   // Step 1: Check if attendee info is filled for all selected tickets
    //   const hasValidAttendees = selectedTickets.every((ticket: any) => {
    //     if (!ticket.attendees || ticket.attendees.length !== ticket.quantity) {
    //       return false;
    //     }
    //     return ticket.attendees.every((attendee: any) => 
    //       attendee && 
    //       attendee.name && 
    //       attendee.name.trim() !== '' &&
    //       attendee.email && 
    //       attendee.email.trim() !== ''
    //     );
    //   });

    //   if (!hasValidAttendees) {
    //     toast.error("Please fill in attendee information for all tickets");
    //     return;
    //   }
    // }

    if (isFree && currentStep === 0) {
      setCurrentStep(2)
      setPreviousStep(0);
      return
    }
    if (isFree && currentStep === 2) {
      BuyFreeTicket()
      return
    }

    setPreviousStep(currentStep);
    if (currentStep < 2) {
      setCurrentStep((s) => s + 1);
    } else {
      // Final step - submit form
      await processForm(selectedTickets);
    }
  };

  const watchedTickets = watch("tickets") || [];
  const selectedWithIndex = watchedTickets
    .map((t: any, i: number) => ({ ...t, __index: i }))
    .filter((t: any) => t.quantity > 0);

  // Calculate total price
  const totalPrice = selectedWithIndex.reduce((total: number, ticket: any) => {
    const ticketType = ticketTypes.find(tt => tt.eventTicketTypeId === ticket.ticketTypeId);
    return total + (ticketType ? ticketType.ticketTypePrice * ticket.quantity : 0);
  }, 0);

  async function MoncashPayment() {
    setIsLoading(true)
    const values = getValues();
    const selectedTickets = values.tickets.filter((t: any) => t.quantity > 0);
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${event.eventId}/payments/moncash`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${user.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedTickets)
    })
    const response = await request.json()


    setIsLoading(false)
  }
  const router = useRouter()

  async function BuyFreeTicket() {
    setIsLoading(true)
    const values = getValues();
    const selectedTickets = values.tickets.filter((t: any) => t.quantity > 0);
    const result = await FreeEventTicket(user.accessToken, event.eventId, selectedTickets)
    if (result.status === 'failed') {
      setIsLoading(false)
      toast.error(result.message)
      return
    }
    router.push(`/upcoming/${Slugify(event.eventName)}`)

    setIsLoading(false)
  }

  return (
    <>
      <PageLoader isLoading={isLoading} />
      <div className='relative h-full min-h-0 flex flex-col'>
        {currentStep === 0 ? <div className='flex flex-col gap-4'>
          <BackButton text={t('back')} />
          <span className='font-primary font-medium text-[2.6rem] leading-12 text-black mb-4'>
            {t('ticket.title')}
          </span>
        </div>
          :
          <div className='flex flex-col gap-4'>
            <button
              onClick={prev}
              className={'flex max-w-[80px] cursor-pointer items-center gap-4'}
            >
              <div
                className={
                  'w-[35px] h-[35px] rounded-full bg-neutral-100 flex items-center justify-center'
                }
              >
                <ArrowLeft2 size="20" color="#0d0d0d" variant="Bulk" />
              </div>
              <span className={'text-neutral-700 font-normal text-[1.4rem] leading-8'}>
                {t('back')}
              </span>
            </button>
            {currentStep === 1 ? <span className='font-primary font-medium text-[2.6rem] leading-12 text-black mb-4'>
              {t('recipient.title')}
            </span> : <span className='font-primary font-medium text-[2.6rem] leading-12 text-black mb-4'>
              {t('payment.title')}
            </span>}
          </div>
        }
        <main className="w-full gap-8 flex flex-col lg:grid lg:grid-cols-[29fr_23fr] lg:min-h-0 overflow-y-auto h-full">
          {/* Ticket Selection Step */}
          {currentStep === 0 && (
            <motion.div
              initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              layout={false}
              className="flex flex-col gap-8 overflow-y-auto min-h-0"
            >
              <ul className="flex flex-col gap-8 ">
                {fields.map((field, index) => {
                  const ticketType = ticketTypes[index];
                  const quantity = watch(`tickets.${index}.quantity`) || 0;

                  return (
                    <li
                      key={field.id}
                      className="border border-neutral-100 rounded-[15px] p-[15px] flex flex-col gap-4"
                    >
                      <div className="flex flex-col gap-4">
                        <span className="font-semibold text-[1.6rem] leading-10 text-deep-100">
                          {Capitalize(ticketType.ticketTypeName)}
                        </span>
                        <p className="text-[1.5rem] leading-12 text-neutral-700">
                          {ticketType.ticketTypeDescription}
                        </p>
                      </div>
                      {isFree ? <span className="font-primary font-bold text-[1.8rem] leading-12 text-primary-500">
                        {t('free')}
                      </span> : <span className="font-primary font-bold text-[1.8rem] leading-12 text-primary-500">
                        {ticketType.ticketTypePrice} {event.currency}
                      </span>}
                      <div className="flex bg-neutral-100 items-center justify-between py-4 px-[1.5rem] rounded-[10px]">
                        <span className="text-[1.5rem] text-neutral-900">
                          {t("ticket.quantity")}
                        </span>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            disabled={isFree}
                            className="w-[35px] h-[35px] rounded-full bg-black flex items-center justify-center"
                            onClick={() => {
                              const currentValue = getValues(`tickets.${index}.quantity`) || 0;
                              const newQuantity = Math.max(0, currentValue - 1);
                              setValue(`tickets.${index}.quantity`, newQuantity, { shouldValidate: true });

                              // Update attendees array to match new quantity
                              const currentAttendees = getValues(`tickets.${index}.attendees`) || [];
                              if (newQuantity < currentAttendees.length) {
                                setValue(`tickets.${index}.attendees`, currentAttendees.slice(0, newQuantity));
                              }
                            }}
                          >
                            <MinusCirlce size="20" color="#FFFFFF" variant="Bulk" />
                          </button>

                          <span className="text-[1.5rem] leading-12 text-neutral-900">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            disabled={isFree}
                            className="w-[35px] h-[35px] rounded-full bg-black flex items-center justify-center"
                            onClick={() => {
                              const currentValue = getValues(`tickets.${index}.quantity`) || 0;
                              const newQuantity = currentValue + 1;
                              setValue(`tickets.${index}.quantity`, newQuantity, { shouldValidate: true });

                              // Update attendees array to match new quantity
                              const currentAttendees = getValues(`tickets.${index}.attendees`) || [];
                              if (newQuantity > currentAttendees.length) {
                                const newAttendees = [...currentAttendees];
                                for (let i = currentAttendees.length; i < newQuantity; i++) {
                                  newAttendees.push({ name: '', email: '' });
                                }
                                setValue(`tickets.${index}.attendees`, newAttendees);
                              }
                            }}
                          >
                            <AddCircle size="20" color="#FFFFFF" variant="Bulk" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
                <li className='hidden lg:block'></li>
                <li className='hidden lg:block'></li>
                <li className='hidden lg:block'></li>
                <li className='hidden lg:block'></li>
                <li className='hidden lg:block'></li>
              </ul>
              <div className="lg:hidden flex flex-col gap-8">
                <div className=' flex flex-col gap-8 h-[500px] bg-[rgba(0,0,0,0.05)] w-full lg:h-[681px] relative shadow-[0_15px_25px_0_rgba(0,0,0,0.05)]'>
                  <Image src={ticketBG} alt={'ticket bg'} className='h-full' />
                  <div
                    className={
                      'absolute top-0 w-full px-4 left-[50%] -translate-x-[50%] flex flex-col items-center gap-8'
                    }
                  >
                    <span className={'font-primary font-medium pt-4 text-[2.2rem] leading-[30px] text-black'}>
                      {t('ticket.summary')}
                    </span>
                    <div
                      className={
                        'w-full h-[250px] lg:h-[296px]  bg-neutral-100 p-[15px] text-center flex flex-col justify-between items-center '
                      }
                    >
                      <div className={'flex flex-col gap-8 w-full'}>
                        <span className={'font-mono text-[14px] leading-[22px] text-deep-100 text-center'}>
                          {selectedWithIndex.length > 0 ? t('ticket.select') : t('ticket.select')}
                        </span>
                        <div className={'flex flex-col gap-4'}>
                          {selectedWithIndex.length > 0 ? (
                            selectedWithIndex.map((ticket: any) => {
                              const ticketType = ticketTypes.find(tt => tt.eventTicketTypeId === ticket.ticketTypeId);
                              return (
                                <div key={ticket.ticketTypeId} className={'w-full flex justify-between'}>
                                  <span className={'font-mono text-[1.4rem] leading-[22px] text-neutral-600'}>
                                    x{ticket.quantity} {ticketType ? Capitalize(ticketType.ticketTypeName) : 'Unknown'}
                                  </span>
                                  {isFree ? <span className={'font-medium text-[1.4rem] leading-[22px] text-deep-100'}>
                                    {t('free')}
                                  </span> : <span className={'font-medium text-[1.4rem] leading-[22px] text-deep-100'}>
                                    {ticketType ? ticketType.ticketTypePrice * ticket.quantity : 0} {event.currency}
                                  </span>}
                                </div>
                              );
                            })
                          ) : (
                            <div className={'w-full flex justify-center'}>
                              <span className={'font-mono text-[1.4rem] leading-[22px] text-neutral-400'}>
                                No tickets selected
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      'absolute bottom-[7%] h-[83px] left-[50%] -translate-x-[50%] flex flex-col gap-8'
                    }
                  >
                    {selectedWithIndex.length > 0 && (
                      <>
                        <div className={'flex gap-4 justify-center flex-wrap'}>
                          {selectedWithIndex.map((ticket: any) => {
                            const ticketType = ticketTypes.find(tt => tt.eventTicketTypeId === ticket.ticketTypeId);
                            return (
                              <span
                                key={ticket.ticketTypeId}
                                className={
                                  'text-primary-500 text-[1.4rem] leading-[20px] px-[15px] py-[5px] bg-primary-50 rounded-[20px]'
                                }
                              >
                                {ticketType ? Capitalize(ticketType.ticketTypeName) : 'Unknown'}
                              </span>
                            );
                          })}
                        </div>
                        {isFree ? <span className={'font-primary font-medium text-[28px] leading-[32px] text-[#000]'}>
                          {t('free')}
                        </span> : <span className={'font-primary font-medium text-[28px] leading-[32px] text-[#000]'}>
                          {totalPrice} {event.currency}
                        </span>}
                      </>
                    )}
                  </div>
                </div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className='lg:hidden'></div>
              <div className='lg:hidden'></div>
              <div className='lg:hidden'></div>
            </motion.div>
          )}

          {/* Recipient Information Step */}
          {currentStep === 1 && (
            <motion.div
              initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex flex-col gap-8 overflow-y-auto min-h-0">
              <div className="flex flex-col gap-8">
                {selectedWithIndex.map((ticket: any) => {
                  const idx = ticket.__index;
                  const ticketType = ticketTypes.find(tt => tt.eventTicketTypeId === ticket.ticketTypeId);

                  return (
                    <div key={`${ticket.ticketTypeId}-${idx}`} className="">
                      {/* <h3 className="font-semibold text-lg mb-4">
                      {ticketType ? Capitalize(ticketType.ticketTypeName) : 'Unknown Ticket'}
                      ({ticket.quantity} {ticket.quantity === 1 ? 'ticket' : 'tickets'})
                    </h3> */}
                      <div className="flex flex-col gap-6">
                        {Array.from({ length: ticket.quantity }, (_, attendeeIndex: number) => {
                          const checkboxFieldName = `tickets.${idx}.attendees.${attendeeIndex}.isForSomeoneElse`;
                          const isChecked = watch(checkboxFieldName);

                          return (
                            <div key={`attendee-${attendeeIndex}`} className="border border-neutral-100 rounded-[15px] flex flex-col gap-[1.5rem] p-[15px]">
                              <div className='flex items-center w-full justify-between font-semibold text-[1.6rem] leading-8 text-deep-100'>
                                <span>#{attendeeIndex + 1}</span>
                                <span>{ticketType ? Capitalize(ticketType.ticketTypeName) : 'Unknown Ticket'}</span>
                              </div>
                              <div className='flex items-center justify-between py-4 px-[1.5rem] bg-neutral-100 rounded-[10px]'>
                                <span className='text-[1.5rem] leading-12 text-neutral-900'>{t('recipient.someone')}</span>
                                <label className="relative inline-block h-[30px] w-[50px] cursor-pointer rounded-full bg-neutral-600 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-primary-500">
                                  <input
                                    {...register(checkboxFieldName)}
                                    className="peer sr-only"
                                    id={`ticket-${idx}-attendee-${attendeeIndex}`}
                                    type="checkbox"
                                  />
                                  <ToggleIcon />
                                </label>
                              </div>
                              {isChecked && (
                                <div className="flex flex-col gap-3">
                                  <Input {...register(`tickets.${idx}.attendees.${attendeeIndex}.name`)}>{t('recipient.name')}</Input>
                                  <Input {...register(`tickets.${idx}.attendees.${attendeeIndex}.email`)}>{t('recipient.email')}</Input>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                <div></div>
                <div className='hidden lg:block'></div>
                <div className='hidden lg:block'></div>
                <div className='hidden lg:block'></div>
                <div className='hidden lg:block'></div>
              </div>
              <div className="lg:hidden flex flex-col gap-8">
                <div className=' flex flex-col gap-8 h-[500px] bg-[rgba(0,0,0,0.05)] w-full lg:h-[681px] relative shadow-[0_15px_25px_0_rgba(0,0,0,0.05)]'>
                  <Image src={ticketBG} alt={'ticket bg'} className='h-full' />
                  <div
                    className={
                      'absolute top-0 w-full px-4 left-[50%] -translate-x-[50%] flex flex-col items-center gap-8'
                    }
                  >
                    <span className={'font-primary font-medium pt-4 text-[2.2rem] leading-[30px] text-black'}>
                      {t('ticket.summary')}
                    </span>
                    <div
                      className={
                        'w-full h-[250px] lg:h-[296px]  bg-neutral-100 p-[15px] text-center flex flex-col justify-between items-center '
                      }
                    >
                      <div className={'flex flex-col gap-8 w-full'}>
                        <span className={'font-mono text-[14px] leading-[22px] text-deep-100 text-center'}>
                          {selectedWithIndex.length > 0 ? t('ticket.select') : t('ticket.select')}
                        </span>
                        <div className={'flex flex-col gap-4'}>
                          {selectedWithIndex.length > 0 ? (
                            selectedWithIndex.map((ticket: any) => {
                              const ticketType = ticketTypes.find(tt => tt.eventTicketTypeId === ticket.ticketTypeId);
                              return (
                                <div key={ticket.ticketTypeId} className={'w-full flex justify-between'}>
                                  <span className={'font-mono text-[1.4rem] leading-[22px] text-neutral-600'}>
                                    x{ticket.quantity} {ticketType ? Capitalize(ticketType.ticketTypeName) : 'Unknown'}
                                  </span>
                                  {isFree ? <span className={'font-medium text-[1.4rem] leading-[22px] text-deep-100'}>
                                    {t('free')}
                                  </span> : <span className={'font-medium text-[1.4rem] leading-[22px] text-deep-100'}>
                                    {ticketType ? ticketType.ticketTypePrice * ticket.quantity : 0} {event.currency}
                                  </span>}
                                </div>
                              );
                            })
                          ) : (
                            <div className={'w-full flex justify-center'}>
                              <span className={'font-mono text-[1.4rem] leading-[22px] text-neutral-400'}>
                                No tickets selected
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      'absolute bottom-[7%] h-[83px] left-[50%] -translate-x-[50%] flex flex-col gap-8'
                    }
                  >
                    {selectedWithIndex.length > 0 && (
                      <>
                        <div className={'flex gap-4 justify-center flex-wrap'}>
                          {selectedWithIndex.map((ticket: any) => {
                            const ticketType = ticketTypes.find(tt => tt.eventTicketTypeId === ticket.ticketTypeId);
                            return (
                              <span
                                key={ticket.ticketTypeId}
                                className={
                                  'text-primary-500 text-[1.4rem] leading-[20px] px-[15px] py-[5px] bg-primary-50 rounded-[20px]'
                                }
                              >
                                {ticketType ? Capitalize(ticketType.ticketTypeName) : 'Unknown'}
                              </span>
                            );
                          })}
                        </div>
                        {isFree ? <span className={'font-primary font-medium text-[28px] leading-[32px] text-[#000]'}>
                          {t('free')}
                        </span> : <span className={'font-primary font-medium text-[28px] leading-[32px] text-[#000]'}>
                          {totalPrice} {event.currency}
                        </span>}
                      </>
                    )}
                  </div>
                </div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className='lg:hidden'></div>
              <div className='lg:hidden'></div>
              <div className='lg:hidden'></div>
            </motion.div>
          )}

          {/* Payment Step */}
          {currentStep === 2 && (
            <motion.div
              initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex flex-col gap-8 overflow-y-auto min-h-0">
              <div className="flex flex-col gap-8">
                {isFree ? <div className={
                  "flex flex-col items-start gap-4 p-[15px] rounded-[15px] border border-neutral-100 text-[1.5rem] leading-12 text-neutral-700"
                }><InfoCircle size="20" color="#E45B00" />{t('payment.nopayment')}</div> : <div className="flex flex-col gap-8">

                  {/* MONCASH */}
                  <button
                    className={
                      "flex items-center justify-between cursor-pointer p-[15px] rounded-[15px] border border-neutral-100"
                    }
                    onClick={MoncashPayment}
                  >
                    <div className={"flex items-center gap-4"}>
                      <Image src={moncash} alt={"Logo of moncash"} />
                      <span
                        className={
                          "font-semibold text-[1.6rem] leading-[22px] text-deep-100"
                        }
                      >
                        {t("payment.moncash")}
                      </span>
                    </div>
                    <ArrowRight2 size="20" color="#0d0d0d" variant="Bulk" />
                  </button>
                  {/* CARD */}
                  <div
                    className={
                      "flex flex-col gap-[15px] p-[15px] rounded-[15px] border border-neutral-100 "
                    }
                  >
                    <div className={"flex items-center justify-between"}>
                      <div className={"flex items-center gap-4"}>
                        <Card size="20" color="#0d0d0d" variant="Bulk" />
                        <span
                          className={
                            "font-semibold text-[1.6rem] leading-[22px] text-deep-100"
                          }
                        >
                          {t("payment.card")}
                        </span>
                      </div>
                      <ArrowRight2 size="20" color="#0d0d0d" variant="Bulk" />
                    </div>
                    <div
                      className={"flex flex-col lg:flex-row items-center gap-[15px]"}
                    >
                      <input
                        className={
                          "bg-neutral-100 w-full rounded-[5rem] p-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border border-transparent focus:border-primary-500"
                        }
                        type="text"
                        placeholder={t("payment.placeholders.name")}
                      />
                      <input
                        className={
                          "bg-neutral-100 w-full lg:w-[135px] rounded-[5rem] p-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border border-transparent focus:border-primary-500"
                        }
                        type="text"
                        placeholder={t("payment.placeholders.expiry")}
                      />
                    </div>
                    <div
                      className={"flex flex-col lg:flex-row items-center gap-[15px]"}
                    >
                      <input
                        className={
                          "bg-neutral-100 w-full rounded-[5rem] p-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border border-transparent focus:border-primary-500"
                        }
                        type="text"
                        placeholder={t("payment.placeholders.number")}
                      />
                      <input
                        className={
                          "bg-neutral-100 w-full lg:w-[135px] rounded-[5rem] p-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border border-transparent focus:border-primary-500"
                        }
                        type="text"
                        placeholder={"CVV"}
                      />
                    </div>
                  </div>

                  {/* PAYPAL */}
                  {/* <div
                className={
                  "flex items-center justify-between p-[15px] rounded-[15px] border border-neutral-100"
                }
              >
                <div className={"flex items-center gap-4"}>
                  <Image src={paypal} alt={"Logo of paypal"} />
                  <span
                    className={
                      "font-semibold text-[1.6rem] leading-[22px] text-deep-100"
                    }
                  >
                    {t("payment.paypal")}
                  </span>
                </div>
                <ArrowRight2 size="20" color="#0d0d0d" variant="Bulk" />
              </div> */}
                </div>}
                <div></div>
                <div></div>
                <div></div>
                <div className='hidden lg:block'></div>
                {/* <div>
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <ul className="space-y-2 mb-4">
                {selectedWithIndex.map((ticket: any) => {
                  const ticketType = ticketTypes.find(tt => tt.eventTicketTypeId === ticket.ticketTypeId);
                  return (
                    <li key={ticket.ticketTypeId} className="flex justify-between">
                      <span>{ticket.quantity}x {ticketType ? Capitalize(ticketType.ticketTypeName) : 'Unknown'}</span>
                      <span>{ticketType ? ticketType.ticketTypePrice * ticket.quantity : 0} {event.currency}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{totalPrice} {event.currency}</span>
                </div>
              </div>
            </div> */}
              </div>
              <div className="lg:hidden flex flex-col gap-8">
                <div className=' flex flex-col gap-8 h-[500px] bg-[rgba(0,0,0,0.05)] w-full lg:h-[681px] relative shadow-[0_15px_25px_0_rgba(0,0,0,0.05)]'>
                  <Image src={ticketBG} alt={'ticket bg'} className='h-full' />
                  <div
                    className={
                      'absolute top-0 w-full px-4 left-[50%] -translate-x-[50%] flex flex-col items-center gap-8'
                    }
                  >
                    <span className={'font-primary font-medium pt-4 text-[2.2rem] leading-[30px] text-black'}>
                      {t('ticket.summary')}
                    </span>
                    <div
                      className={
                        'w-full h-[250px] lg:h-[296px]  bg-neutral-100 p-[15px] text-center flex flex-col justify-between items-center '
                      }
                    >
                      <div className={'flex flex-col gap-8 w-full'}>
                        <span className={'font-mono text-[14px] leading-[22px] text-deep-100 text-center'}>
                          {selectedWithIndex.length > 0 ? t('ticket.select') : t('ticket.select')}
                        </span>
                        <div className={'flex flex-col gap-4'}>
                          {selectedWithIndex.length > 0 ? (
                            selectedWithIndex.map((ticket: any) => {
                              const ticketType = ticketTypes.find(tt => tt.eventTicketTypeId === ticket.ticketTypeId);
                              return (
                                <div key={ticket.ticketTypeId} className={'w-full flex justify-between'}>
                                  <span className={'font-mono text-[1.4rem] leading-[22px] text-neutral-600'}>
                                    x{ticket.quantity} {ticketType ? Capitalize(ticketType.ticketTypeName) : 'Unknown'}
                                  </span>
                                  {isFree ? <span className={'font-medium text-[1.4rem] leading-[22px] text-deep-100'}>
                                    {t('free')}
                                  </span> : <span className={'font-medium text-[1.4rem] leading-[22px] text-deep-100'}>
                                    {ticketType ? ticketType.ticketTypePrice * ticket.quantity : 0} {event.currency}
                                  </span>}
                                </div>
                              );
                            })
                          ) : (
                            <div className={'w-full flex justify-center'}>
                              <span className={'font-mono text-[1.4rem] leading-[22px] text-neutral-400'}>
                                No tickets selected
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      'absolute bottom-[7%] h-[83px] left-[50%] -translate-x-[50%] flex flex-col gap-8'
                    }
                  >
                    {selectedWithIndex.length > 0 && (
                      <>
                        <div className={'flex gap-4 justify-center flex-wrap'}>
                          {selectedWithIndex.map((ticket: any) => {
                            const ticketType = ticketTypes.find(tt => tt.eventTicketTypeId === ticket.ticketTypeId);
                            return (
                              <span
                                key={ticket.ticketTypeId}
                                className={
                                  'text-primary-500 text-[1.4rem] leading-[20px] px-[15px] py-[5px] bg-primary-50 rounded-[20px]'
                                }
                              >
                                {ticketType ? Capitalize(ticketType.ticketTypeName) : 'Unknown'}
                              </span>
                            );
                          })}
                        </div>
                        {isFree ? <span className={'font-primary font-medium text-[28px] leading-[32px] text-[#000]'}>
                          {t('free')}
                        </span> : <span className={'font-primary font-medium text-[28px] leading-[32px] text-[#000]'}>
                          {totalPrice} {event.currency}
                        </span>}
                      </>
                    )}
                  </div>
                </div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className='lg:hidden'></div>
              <div className='lg:hidden'></div>
              <div className='lg:hidden'></div>

            </motion.div>
          )}

          {/* TICKET SUMMARY VIEW */}
          <div className="hidden lg:flex lg:flex-col lg:overflow-y-auto min-h-0 flex-col gap-20 p-4 pt-0">
            <div className=' flex flex-col gap-8 h-[500px] bg-[rgba(0,0,0,0.05)] w-full lg:h-[681px] relative shadow-[0_15px_25px_0_rgba(0,0,0,0.05)]'>
              <Image src={ticketBG} alt={'ticket bg'} className='h-full' />
              <div
                className={
                  'absolute top-0 w-full px-4 left-[50%] -translate-x-[50%] flex flex-col items-center gap-8'
                }
              >
                <span className={'font-primary font-medium pt-4 text-[2.2rem] leading-[30px] text-black'}>
                  {t('ticket.summary')}
                </span>
                <div
                  className={
                    'w-full h-[250px] lg:h-[296px]  bg-neutral-100 p-[15px] text-center flex flex-col justify-between items-center '
                  }
                >
                  <div className={'flex flex-col gap-8 w-full'}>
                    <span className={'font-mono text-[14px] leading-[22px] text-deep-100 text-center'}>
                      {selectedWithIndex.length > 0 ? t('ticket.select') : t('ticket.select')}
                    </span>
                    <div className={'flex flex-col gap-4'}>
                      {selectedWithIndex.length > 0 ? (
                        selectedWithIndex.map((ticket: any) => {
                          const ticketType = ticketTypes.find(tt => tt.eventTicketTypeId === ticket.ticketTypeId);
                          return (
                            <div key={ticket.ticketTypeId} className={'w-full flex justify-between'}>
                              <span className={'font-mono text-[1.4rem] leading-[22px] text-neutral-600'}>
                                x{ticket.quantity} {ticketType ? Capitalize(ticketType.ticketTypeName) : 'Unknown'}
                              </span>
                              {isFree ? <span className={'font-medium text-[1.4rem] leading-[22px] text-deep-100'}>
                                {t('free')}
                              </span> : <span className={'font-medium text-[1.4rem] leading-[22px] text-deep-100'}>
                                {ticketType ? ticketType.ticketTypePrice * ticket.quantity : 0} {event.currency}
                              </span>}
                            </div>
                          );
                        })
                      ) : (
                        <div className={'w-full flex justify-center'}>
                          <span className={'font-mono text-[1.4rem] leading-[22px] text-neutral-400'}>
                            No tickets selected
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={
                  'absolute bottom-[7%] h-[83px] left-[50%] -translate-x-[50%] flex flex-col gap-8'
                }
              >
                {selectedWithIndex.length > 0 && (
                  <>
                    <div className={'flex gap-4 justify-center flex-wrap'}>
                      {selectedWithIndex.map((ticket: any) => {
                        const ticketType = ticketTypes.find(tt => tt.eventTicketTypeId === ticket.ticketTypeId);
                        return (
                          <span
                            key={ticket.ticketTypeId}
                            className={
                              'text-primary-500 text-[1.4rem] leading-[20px] px-[15px] py-[5px] bg-primary-50 rounded-[20px]'
                            }
                          >
                            {ticketType ? Capitalize(ticketType.ticketTypeName) : 'Unknown'}
                          </span>
                        );
                      })}
                    </div>
                    {isFree ? <span className={'font-primary font-medium text-[28px] leading-[32px] text-[#000]'}>
                      {t('free')}
                    </span> : <span className={'font-primary font-medium text-[28px] leading-[32px] text-[#000]'}>
                      {totalPrice} {event.currency}
                    </span>}
                  </>
                )}
              </div>
            </div>
            <div></div>
            <div></div>
          </div>
        </main>

        <div className='absolute bottom-4 py-4 px-[1.5rem] border border-neutral-100 bg-white rounded-[40px] flex items-center w-full justify-between'>
          <div className='hidden lg:flex gap-4 items-center'>
            <span className='text-[1.5rem] leading-12 font-medium text-primary-500'>{t('footer.ticket')}</span>
            <div className={`w-[185px] h-[5px] ${currentStep > 0 ? 'bg-primary-500' : 'bg-neutral-100'} rounded-[100px]`}></div>
            <span className={`text-[1.5rem] leading-12 ${currentStep > 0 ? 'text-primary-500 font-medium' : 'text-neutral-600 font-normal'}`}>{t('footer.recipient')}</span>
            <div className={`w-[185px] h-[5px] ${currentStep === 2 ? 'bg-primary-500' : 'bg-neutral-100'} rounded-[100px]`}></div>
            <span className={`text-[1.5rem] leading-12 ${currentStep === 2 ? 'text-primary-500 font-medium' : 'text-neutral-600 font-normal'}`}>{t('footer.payment')}</span>
          </div>
          <div className='text-[2.2rem] lg:hidden leading-12 text-neutral-600'>
            <span className='text-primary-500'>{currentStep + 1}</span>/3
          </div>
          <ButtonPrimary disabled={isLoading} onClick={next}>
            {t('footer.continue')}
          </ButtonPrimary>
        </div>
      </div>
    </>
  )
}