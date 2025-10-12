'use client'
import TruncateUrl from '@/lib/TruncateUrl'
import Event from '@/types/Event'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import TopBar from '@workspace/ui/components/TopBar'
import Capitalize from '@workspace/ui/lib/Capitalize'
import { Copy, HambergerMenu, Money3, MoreCircle, ScanBarcode, Scanner, SecurityUser, Send2, TicketDiscount } from 'iconsax-react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import TicketClasses from './TicketClasses'
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover'
import { Link, usePathname } from '@/i18n/navigation'
import { Drawer, DrawerTrigger } from '@workspace/ui/components/drawer'
import EventDrawerContent from './EventDrawerContent'
import { DateTime } from 'luxon'
import Ticket from '@/types/Ticket'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ButtonPrimary } from '@workspace/ui/components/buttons'
import LoadingCircleSmall from '@workspace/ui/components/LoadingCircleSmall'
import { MarkAsActive, MarkAsInactive, UpdateCheckersListAction } from '@/actions/EventActions'
import User from '@/types/User'
import PageLoader from '@/components/Loaders/PageLoader'
import { Input } from '@workspace/ui/components/Inputs'
import FormatDate from '@/lib/FormatDate'

export default function EventPageDetails({ event, tickets, slug, organisationCheckers, user, eventCheckers }: { event: Event, tickets: Ticket[], slug: string; organisationCheckers: any, user: User, eventCheckers: any }) {
  const t = useTranslations('Events.single_event')
  const isFree = event.eventTicketTypes[0]?.ticketTypePrice == 0
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const desiredOrder = ['general', 'vip', 'vvip']
  const sortedTicketClasses = [...event.eventTicketTypes].sort((a, b) => {
    const aIndex = desiredOrder.indexOf(a.ticketTypeName.trim())
    const bIndex = desiredOrder.indexOf(b.ticketTypeName.trim())
    return aIndex - bIndex
  })
  const [currentUrl, setCurrentUrl] = useState('')
  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const today = DateTime.now()
  const eventStart = event.eventDays?.[0]?.startDate
    ? DateTime.fromISO(event.eventDays[0].startDate)
    : null
  const daysLeft = eventStart ? eventStart.diff(today, 'days').days : null
  const roundedDays = Math.ceil(daysLeft && daysLeft > 0 ? daysLeft : 0)

  const closeRef = useRef<HTMLButtonElement>(null)
  const addCheckersSchema = z.object({
    eventCheckers: z.array(z.object({ userId: z.string(), firstName: z.string().optional(), lastName: z.string().optional() }), { error: issue => issue.input === undefined ? "Select at least one Checker" : "Select at least one Checker" }).min(1, "Select at least one Checker"),
  })
  type TaddCheckersSchema = z.infer<typeof addCheckersSchema>
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<TaddCheckersSchema>({
    resolver: zodResolver(addCheckersSchema),
    defaultValues: eventCheckers
  })
  async function UpdateCheckers(data: TaddCheckersSchema) {
    const result = await UpdateCheckersListAction(event.eventId, user.accessToken, pathname, data)
    if (result.status !== 'success') {
      toast.error(result.error)
    }
    closeRef.current?.click()
  }
  async function MarkEventAsActive() {
    setIsLoading(true)
    const result = await MarkAsActive(event.eventId, user.accessToken, pathname)
    if (result.status !== 'success') {
      toast.error(result.error)
    }
    setIsLoading(false)
  }
  async function MarkEventAsInactive() {
    setIsLoading(true)
    const result = await MarkAsInactive(event.eventId, user.accessToken, pathname)
    if (result.status !== 'success') {
      toast.error(result.error)
    }
    setIsLoading(false)
  }
  const [ticketID, setTicketID] = useState('')
  const [ticketIdError, setTicketIdError] = useState('')
  async function CheckTicketID() {
    setIsLoading(true)
    if (ticketID.trim()) {
      const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checking/event/${event.eventId}/ticket-id/${ticketID}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user.accessToken}`
        },
      })
      const response = await request.json()
      if (response.status === 'success') {
        toast.success('success')
        setTicketID('')
      } else {
        toast.error(response.message)
      }
    } else {
      setTicketIdError('Enter TicketID')
    }
    setIsLoading(false)
  }
  return (
    <div className={'flex flex-col gap-[3rem] overflow-y-scroll'}>
      <PageLoader isLoading={isLoading} />
      <TopBar title={event.eventName}>
        <div className='hidden lg:flex items-center gap-4'>

          {event.eventType !== 'meet' && <Dialog>
            <DialogTrigger>
              <span className='px-[15px] py-[7.5px] border-2 border-transparent rounded-[100px] text-center font-medium text-[1.5rem] h-auto leading-[20px] cursor-pointer transition-all duration-400 flex items-center justify-center gap-4 bg-neutral-100 text-neutral-700'>
                <Scanner variant={'Bulk'} color={'#737C8A'} size={20} />
                {t('check_in')}
              </span>
            </DialogTrigger>
            <DialogContent className={'w-[360px] lg:w-[520px] '}>
              <DialogHeader>
                <DialogTitle
                  className={
                    'font-medium border-b border-neutral-100 pb-[2rem]  text-[2.6rem] leading-[30px] text-black font-primary'
                  }
                >
                  {t('check_in')}
                </DialogTitle>
                <DialogDescription className={'sr-only'}>
                  <span>Share event</span>
                </DialogDescription>
              </DialogHeader>
              <div className={'flex flex-col w-auto justify-center items-center gap-[30px]'}>
                <p
                  className={
                    'font-sans text-[1.8rem] leading-[25px] text-[#cdcdcd] text-center w-[320px] lg:w-full'
                  }
                >
                  {t('check_in_description')}
                </p>
                <div className='w-full'>
                  <Input value={ticketID} onChange={e => setTicketID(e.target.value)} error={ticketIdError}>{t('ticketID')}</Input>
                  <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
                    {errors.eventCheckers?.message}
                  </span>
                </div>
              </div>
              <DialogFooter>
                <ButtonPrimary onClick={CheckTicketID} disabled={isLoading} className='w-full'>{isLoading ? <LoadingCircleSmall /> : t('check_in')}</ButtonPrimary>
                <DialogClose ref={closeRef} className='sr-only'></DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>}
          {/* Share Event */}
          {daysLeft !== null && daysLeft > 0 && <Dialog>
            <DialogTrigger>
              <span className='px-[15px] py-[7.5px] border-2 border-transparent rounded-[100px] text-center font-medium text-[1.5rem] h-auto leading-[20px] cursor-pointer transition-all duration-400 flex items-center justify-center gap-4 bg-neutral-100 text-neutral-700'>
                <Send2 variant={'Bulk'} color={'#737C8A'} size={20} />
                {t('share')}
              </span>
            </DialogTrigger>
            <DialogContent className={'w-[360px] lg:w-[520px] '}>
              <DialogHeader>
                <DialogTitle
                  className={
                    'font-medium border-b border-neutral-100 pb-[2rem]  text-[2.6rem] leading-[30px] text-black font-primary'
                  }
                >
                  {t('share')}
                </DialogTitle>
                <DialogDescription className={'sr-only'}>
                  <span>Share event</span>
                </DialogDescription>
              </DialogHeader>
              <div className={'flex flex-col w-auto justify-center items-center gap-[30px]'}>
                <p
                  className={
                    'font-sans text-[1.8rem] leading-[25px] text-[#cdcdcd] text-center w-[320px] lg:w-full'
                  }
                >
                  {t('share_text')}
                </p>
                <div
                  className={
                    'border w-auto border-neutral-100 rounded-[100px] p-4 flex  items-center gap-4'
                  }
                >
                  <span className={'lg:hidden text-neutral-700 text-[1.8rem] max-w-[335px]'}>
                    {TruncateUrl(currentUrl, 22)}
                  </span>
                  <span
                    className={'hidden lg:block text-neutral-700 text-[1.8rem] max-w-[335px]'}
                  >
                    {TruncateUrl(currentUrl)}
                  </span>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(currentUrl)
                        toast.success('Url copied to clipboard')
                      } catch (e) {
                        toast.error('Failed to copy url')
                      }
                    }}
                    className={
                      'border-2 border-primary-500 px-[15px] py-[7px] rounded-[10rem] font-normal text-[1.5rem] text-primary-500 leading-[20px] bg-primary-50 cursor-pointer flex'
                    }
                  >
                    <Copy size="20" color="#e45b00" variant="Bulk" />
                    Copy
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>}

          {daysLeft !== null && daysLeft > 0 && !isFree && !(event.eventType === 'meet') && <TicketClasses event={event} />}
          {/* more */}
          <Popover>
            <PopoverTrigger>
              <div
                className={
                  'w-[35px] h-[35px] cursor-pointer rounded-full bg-neutral-100 flex items-center justify-center'
                }
              >
                <MoreCircle variant={'Bulk'} size={20} color={'#737C8A'} />
              </div>
            </PopoverTrigger>
            <PopoverContent className={'w-[250px] p-0 m-0 bg-none shadow-none border-none mx-4'}>
              <ul
                className={
                  'bg-neutral-100 border border-neutral-200 right-8 p-4  mb-8 rounded-[1rem] shadow-xl bottom-full flex flex-col gap-4'
                }
              >
                <span
                  className={
                    'font-medium py-[5px] border-b-[1px] border-neutral-200 text-[1.4rem] text-deep-100 leading-[20px]'
                  }
                >
                  {t('more')}
                </span>
                <div className={'flex flex-col gap-4'}>
                  {/* {!event.isFree && ( */}
                  {daysLeft !== null && daysLeft > 0 && !isFree && <li>
                    <Link
                      href={`${slug}/discount-codes`}
                      className={`cursor-pointer font-normal group text-[1.5rem] border-b-[1px] border-neutral-200 py-4 leading-[20px] text-neutral-700 hover:text-primary-500 flex items-center justify-between w-full`}
                    >
                      <span className={'text-primary-500'}>
                        {t('discount.subtitle')}
                      </span>
                      <TicketDiscount size="20" variant="Bulk" color={'#E45B00'} />
                    </Link>
                  </li>}
                  <li className={''}>
                    <Drawer direction={'right'}>
                      <DrawerTrigger
                        className={'w-full'}>
                        <div
                          className={`font-normal cursor-pointer group text-[1.5rem] border-b-[1px] border-neutral-200 py-4 leading-[20px] text-neutral-700 hover:text-primary-500 flex items-center justify-between w-full`}
                        >
                          <span className={''}>{t('details')}</span>
                          <HambergerMenu size="20" variant="Bulk" color={'#2E3237'} />
                        </div>
                      </DrawerTrigger>
                      <EventDrawerContent event={event} />
                    </Drawer>
                  </li>
                  {event.eventType !== 'meet' && <>
                    <li>
                      <Dialog>
                        <DialogTrigger className='w-full'>
                          <div
                            className={`font-normal cursor-pointer group text-[1.5rem] border-b-[1px] border-neutral-200 py-4 leading-[20px] text-neutral-700 hover:text-primary-500 flex items-center justify-between w-full`}
                          >
                            <span className={''}>{t('checkers')}</span>
                            <SecurityUser size="20" variant="Bulk" color={'#2E3237'} />
                          </div>
                        </DialogTrigger>
                        <DialogContent className={'w-[360px] lg:w-[520px] '}>
                          <DialogHeader>
                            <DialogTitle
                              className={
                                'font-medium border-b border-neutral-100 pb-[2rem]  text-[2.6rem] leading-[30px] text-black font-primary'
                              }
                            >
                              {t('checkers')}
                            </DialogTitle>
                            <DialogDescription className={'sr-only'}>
                              <span>Share event</span>
                            </DialogDescription>
                          </DialogHeader>
                          <div className={'flex flex-col w-auto justify-center items-center gap-[30px]'}>
                            <p
                              className={
                                'font-sans text-[1.8rem] leading-[25px] text-[#cdcdcd] text-center w-[320px] lg:w-full'
                              }
                            >
                              {t('checkers_description')}
                            </p>
                            <div className='w-full'>
                              <Controller
                                control={control}
                                name="eventCheckers"
                                defaultValue={eventCheckers}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    isMulti
                                    options={organisationCheckers}
                                    placeholder={t('select_checkers')}
                                    styles={{ control: () => ({ borderColor: 'transparent', display: 'flex' }) }}
                                    getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                                    getOptionValue={(option) => option.userId}
                                    className={
                                      'bg-neutral-100 w-full rounded-[5rem] p-4 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500'
                                    }
                                  />
                                )}
                              />
                              <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
                                {errors.eventCheckers?.message}
                              </span>
                            </div>
                          </div>
                          <DialogFooter>
                            <ButtonPrimary onClick={handleSubmit(UpdateCheckers)} disabled={isSubmitting} className='w-full'>{isSubmitting ? <LoadingCircleSmall /> : t('update_checker')}</ButtonPrimary>
                            <DialogClose ref={closeRef} className='sr-only'></DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </li>
                    {event.isActive ?
                      <li>
                        <button
                          onClick={MarkEventAsInactive}
                          className={`cursor-pointer font-normal group text-[1.5rem]  py-4 leading-[20px] text-neutral-700 hover:text-primary-500 flex items-center justify-between w-full`}
                        >
                          <span className={'text-failure'}>
                            {t('stopChecking')}
                          </span>
                          <ScanBarcode size="20" variant="Bulk" color={'#DE0028'} />
                        </button>
                      </li> :
                      <li>
                        <button onClick={MarkEventAsActive}
                          className={`cursor-pointer font-normal group text-[1.5rem] py-4 leading-[20px] text-neutral-700 hover:text-primary-500 flex items-center justify-between w-full`}
                        >
                          <span className={'text-primary-500'}>
                            {t('startChecking')}
                          </span>
                          <ScanBarcode size="20" variant="Bulk" color={'#E45B00'} />
                        </button>
                      </li>
                    }</>}


                  {/*<li className={''}>*/}
                  {/*  <button*/}
                  {/*    className={`font-normal group text-[1.5rem] py-4 leading-[20px] text-neutral-700 hover:text-primary-500 flex items-center justify-between w-full`}*/}
                  {/*  >*/}
                  {/*    <span className={''}>{single_event.export}</span>*/}
                  {/*    <DocumentDownload size="20" variant="Bulk" color={'#2E3237'} />*/}
                  {/*  </button>*/}
                  {/*</li>*/}
                </div>
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      </TopBar>
      {/* count details */}
      <ul className={
        'grid grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-neutral-100 border-neutral-100 border-b'
      }>
        <li className={'pb-[30px]'}>
          <span className={'text-[14px] text-neutral-600 leading-[20px] pb-[5px]'}>
            {t('revenue')}
          </span>
          <p className={'font-medium text-[25px] leading-[30px] font-primary'}>
            {tickets.reduce((acc, curr) => acc + curr.ticketPrice, 0)}{' '}
            <span className={'font-normal text-[1.6rem] lg:text-[25px] text-neutral-500'}>
              HTG
            </span>
          </p>
        </li>
        {event.eventTicketTypes.map((t, index) => {
          const quantity = tickets.filter(ticket => ticket.ticketType.toLowerCase() === t.ticketTypeName.toLowerCase()).length
          return (
            <li
              key={t.ticketTypeName}
              className={`${index % 2 === 0 ? 'pl-[25px] ' : 'pl-0  pt-[20px] '} lg:pt-0 lg:pl-[25px] pb-[30px] ${index === 2 && 'pt-[20px]'}`}
            >
              <span className={'text-[14px] text-neutral-600 leading-[20px] pb-[5px]'}>
                {Capitalize(t.ticketTypeName)}
              </span>
              <p className={'font-medium text-[25px] leading-[30px] font-primary'}>
                {quantity}{' '}
                <span className={'font-normal text-[20px] text-neutral-500'}>
                  / {t.ticketTypeQuantity}
                </span>
              </p>
            </li>
          )
        })}
        <li
          className={`${event.eventTicketTypes.length == 1 && 'py-[20px] lg:pl-[25px] lg:py-0'} `}
        >
          <span className={'text-[14px] text-neutral-600 leading-[20px] pb-[5px]'}>
            {t('count_down')}
          </span>
          <p className={'font-medium  text-[25px] leading-[30px] font-primary'}>
            {roundedDays}
            <span className={'font-normal text-[20px] text-neutral-500'}>
              {' '}
              {t('day')}
            </span>
          </p>
        </li>
      </ul>

      <div className='flex lg:hidden items-center justify-between'>
        {daysLeft !== null && daysLeft > 0 && !isFree && !(event.eventType === 'meet') && <TicketClasses event={event} />}
        {!(event.eventType === 'meet') ? <Dialog>
          <DialogTrigger>
            <span className='px-[15px] py-[7.5px] border-2 border-transparent rounded-[100px] text-center font-medium text-[1.5rem] h-auto leading-[20px] cursor-pointer transition-all duration-400 flex items-center justify-center gap-4 bg-neutral-100 text-neutral-700'>
              <Scanner variant={'Bulk'} color={'#737C8A'} size={20} />
              {t('check_in')}
            </span>
          </DialogTrigger>
          <DialogContent className={'w-[360px] lg:w-[520px] '}>
            <DialogHeader>
              <DialogTitle
                className={
                  'font-medium border-b border-neutral-100 pb-[2rem]  text-[2.6rem] leading-[30px] text-black font-primary'
                }
              >
                {t('check_in')}
              </DialogTitle>
              <DialogDescription className={'sr-only'}>
                <span>Share event</span>
              </DialogDescription>
            </DialogHeader>
            <div className={'flex flex-col w-auto justify-center items-center gap-[30px]'}>
              <p
                className={
                  'font-sans text-[1.8rem] leading-[25px] text-[#cdcdcd] text-center w-[320px] lg:w-full'
                }
              >
                {t('check_in_description')}
              </p>
              <div className='w-full'>
                <Input value={ticketID} onChange={e => setTicketID(e.target.value)} error={ticketIdError}>{t('ticketID')}</Input>
                <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
                  {errors.eventCheckers?.message}
                </span>
              </div>
            </div>
            <DialogFooter>
              <ButtonPrimary onClick={CheckTicketID} disabled={isLoading} className='w-full'>{isLoading ? <LoadingCircleSmall /> : t('check_in')}</ButtonPrimary>
              <DialogClose ref={closeRef} className='sr-only'></DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog> : <div></div>}
        <Popover>
          <PopoverTrigger>
            <div
              className={
                'w-[35px] h-[35px] cursor-pointer rounded-full bg-neutral-100 flex items-center justify-center'
              }
            >
              <MoreCircle variant={'Bulk'} size={20} color={'#737C8A'} />
            </div>
          </PopoverTrigger>
          <PopoverContent className={'w-[250px] p-0 m-0 bg-none shadow-none border-none mx-4'}>
            <ul
              className={
                'bg-neutral-100 border border-neutral-200 right-8 p-4  mb-8 rounded-[1rem] shadow-xl bottom-full flex flex-col gap-4'
              }
            >
              <span
                className={
                  'font-medium py-[5px] border-b-[1px] border-neutral-200 text-[1.4rem] text-deep-100 leading-[20px]'
                }
              >
                {t('more')}
              </span>
              <div className={'flex flex-col gap-4'}>
                {/* {!event.isFree && ( */}
                {daysLeft !== null && daysLeft > 0 && !isFree && <li>
                  <Link
                    href={`${slug}/discount-codes`}
                    className={`cursor-pointer font-normal group text-[1.5rem] border-b-[1px] border-neutral-200 py-4 leading-[20px] text-neutral-700 hover:text-primary-500 flex items-center justify-between w-full`}
                  >
                    <span className={'text-primary-500'}>
                      {t('discount.subtitle')}
                    </span>
                    <TicketDiscount size="20" variant="Bulk" color={'#E45B00'} />
                  </Link>
                </li>}
                <li className={''}>
                  <Drawer direction={'right'}>
                    <DrawerTrigger
                      className={'w-full'}>
                      <div
                        className={`font-normal cursor-pointer group text-[1.5rem] border-b-[1px] border-neutral-200 py-4 leading-[20px] text-neutral-700 hover:text-primary-500 flex items-center justify-between w-full`}
                      >
                        <span className={''}>{t('details')}</span>
                        <HambergerMenu size="20" variant="Bulk" color={'#2E3237'} />
                      </div>
                    </DrawerTrigger>
                    <EventDrawerContent event={event} />
                  </Drawer>
                </li>
                {!(event.eventType === 'meet') && <li>
                  <Dialog>
                    <DialogTrigger className='w-full'>
                      <div
                        className={`font-normal cursor-pointer group text-[1.5rem] border-b-[1px] border-neutral-200 py-4 leading-[20px] text-neutral-700 hover:text-primary-500 flex items-center justify-between w-full`}
                      >
                        <span className={''}>{t('checkers')}</span>
                        <SecurityUser size="20" variant="Bulk" color={'#2E3237'} />
                      </div>
                    </DialogTrigger>
                    <DialogContent className={'w-[360px] lg:w-[520px] '}>
                      <DialogHeader>
                        <DialogTitle
                          className={
                            'font-medium border-b border-neutral-100 pb-[2rem]  text-[2.6rem] leading-[30px] text-black font-primary'
                          }
                        >
                          {t('checkers')}
                        </DialogTitle>
                        <DialogDescription className={'sr-only'}>
                          <span>Share event</span>
                        </DialogDescription>
                      </DialogHeader>
                      <div className={'flex flex-col w-auto justify-center items-center gap-[30px]'}>
                        <p
                          className={
                            'font-sans text-[1.8rem] leading-[25px] text-[#cdcdcd] text-center w-[320px] lg:w-full'
                          }
                        >
                          {t('checkers_description')}
                        </p>
                        <div className='w-full'>
                          <Controller
                            control={control}
                            name="eventCheckers"
                            defaultValue={eventCheckers}
                            render={({ field }) => (
                              <Select
                                {...field}
                                isMulti
                                options={organisationCheckers}
                                placeholder={t('select_checkers')}
                                styles={{ control: () => ({ borderColor: 'transparent', display: 'flex' }) }}
                                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                                getOptionValue={(option) => option.userId}
                                className={
                                  'bg-neutral-100 w-full rounded-[5rem] p-4 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500'
                                }
                              />
                            )}
                          />
                          <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
                            {errors.eventCheckers?.message}
                          </span>
                        </div>
                      </div>
                      <DialogFooter>
                        <ButtonPrimary onClick={handleSubmit(UpdateCheckers)} disabled={isSubmitting} className='w-full'>{isSubmitting ? <LoadingCircleSmall /> : t('update_checker')}</ButtonPrimary>
                        <DialogClose ref={closeRef} className='sr-only'></DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </li>}
                {!(event.eventType === 'meet') && <li>
                  {event.isActive ? <button
                    onClick={MarkEventAsInactive}
                    className={`cursor-pointer font-normal group text-[1.5rem]  py-4 leading-[20px] text-neutral-700 hover:text-primary-500 flex items-center justify-between w-full`}
                  >
                    <span className={'text-failure'}>
                      {t('stopChecking')}
                    </span>
                    <ScanBarcode size="20" variant="Bulk" color={'#DE0028'} />
                  </button> : <button onClick={MarkEventAsActive}
                    className={`cursor-pointer font-normal group text-[1.5rem] py-4 leading-[20px] text-neutral-700 hover:text-primary-500 flex items-center justify-between w-full`}
                  >
                    <span className={'text-primary-500'}>
                      {t('startChecking')}
                    </span>
                    <ScanBarcode size="20" variant="Bulk" color={'#E45B00'} />
                  </button>}
                </li>}


                {/*<li className={''}>*/}
                {/*  <button*/}
                {/*    className={`font-normal group text-[1.5rem] py-4 leading-[20px] text-neutral-700 hover:text-primary-500 flex items-center justify-between w-full`}*/}
                {/*  >*/}
                {/*    <span className={''}>{single_event.export}</span>*/}
                {/*    <DocumentDownload size="20" variant="Bulk" color={'#2E3237'} />*/}
                {/*  </button>*/}
                {/*</li>*/}
              </div>
            </ul>
          </PopoverContent>
        </Popover>
      </div>

      {/* ticket tabs details */}
      <Tabs defaultValue="all" className="w-full h-full ">
        <div className={'flex justify-between'}>
          <TabsList
            className={`w-full  lg:max-w-[318px] lg:w-auto mx-auto lg:mx-0 ${sortedTicketClasses.length === 1 && 'hidden'}`}
          >
            <TabsTrigger value="all">All</TabsTrigger>
            {sortedTicketClasses.length > 1 &&
              sortedTicketClasses.map((ticketClass) => {
                return (
                  <TabsTrigger key={ticketClass.ticketTypeName} value={ticketClass.ticketTypeName}>
                    {Capitalize(ticketClass.ticketTypeName)}
                  </TabsTrigger>
                )
              })}
          </TabsList>
          <div></div>
        </div>
        <TabsContent value="all" className={'w-full'}>
          <Table className={'mt-4'}>
            <TableHeader>
              <TableRow>
                <TableHead
                  className={
                    'font-bold text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                  }
                >
                  {t('table.id')}
                </TableHead>
                <TableHead
                  className={
                    'font-bold text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                  }
                >
                  {t('table.name')}
                </TableHead>
                <TableHead
                  className={
                    'font-bold hidden lg:table-cell text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                  }
                >
                  {t('table.ticket_class')}
                </TableHead>
                <TableHead
                  className={
                    'font-bold hidden lg:table-cell text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                  }
                >
                  {t('table.amount')}
                </TableHead>
                <TableHead
                  className={
                    'font-bold hidden lg:table-cell text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                  }
                >
                  {t('table.check')}
                </TableHead>
                <TableHead
                  className={
                    'font-bold hidden lg:table-cell text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                  }
                >
                  {t('table.date_purchased')}
                </TableHead>
                {/* <TableHead
                  className={
                    'font-bold hidden lg:table-cell text-[1.1rem] pb-[15px] w-[40px] leading-[15px] text-deep-100 uppercase'
                  }
                >
                  {single_event.table.date_purchased}
                </TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map(
                ({ ticketId, ticketName, ticketType, ticketPrice, orderId, createdAt, status, fullName }) => {
                  // const [order] = orders.filter((order) => orderId === order.orderId)
                  return (
                    <TableRow key={ticketId}>
                      <TableCell
                        className={'text-[1.5rem] py-[15px] leading-8 text-neutral-900'}
                      >
                        <span className={'cursor-pointer'}>{ticketName}</span>
                      </TableCell>
                      <TableCell className={'text-[1.5rem] leading-8 text-neutral-900'}>
                        <span className={'cursor-pointer'}>{fullName}</span>
                      </TableCell>
                      <TableCell className={'hidden lg:table-cell'}>
                        {ticketType === 'general' && (
                          <span
                            className={
                              'py-[3px] text-[1.1rem] font-bold leading-[15px] text-center uppercase text-[#EF1870]  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                            }
                          >
                            general
                          </span>
                        )}
                        {ticketType === 'vip' && (
                          <span
                            className={
                              'py-[3px] text-[1.1rem] font-bold leading-[15px] text-center uppercase text-[#7A19C7]  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                            }
                          >
                            vip
                          </span>
                        )}
                        {ticketType === 'vvip' && (
                          <span
                            className={
                              'py-[3px] text-[1.1rem] font-bold leading-[15px] text-center uppercase text-deep-100  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                            }
                          >
                            Premium vip
                          </span>
                        )}
                      </TableCell>
                      <TableCell
                        className={
                          'hidden lg:table-cell text-[1.5rem] font-medium leading-8 text-neutral-900'
                        }
                      >
                        {ticketPrice} HTG
                      </TableCell>
                      <TableCell className={'hidden lg:table-cell'}>
                        {status === 'CHECKED' && (
                          <span
                            className={
                              'py-[3px] text-[1.1rem] font-bold leading-[15px] text-center uppercase text-[#349C2E]  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                            }
                          >
                            {t('filters.checked')}
                          </span>
                        )}
                        {status === 'PENDING' && (
                          <span
                            className={
                              'py-[3px] text-[1.1rem] font-bold leading-[15px] text-center uppercase text-[#EA961C]  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                            }
                          >
                            {t('filters.pending')}
                          </span>
                        )}
                      </TableCell>
                      <TableCell
                        className={
                          'hidden lg:table-cell text-[1.5rem] leading-8 text-neutral-900'
                        }
                      >
                        {FormatDate(createdAt)}
                      </TableCell>
                      {/* <TableCell className={'text-[1.5rem] leading-8 text-neutral-900'}>
                        <Popover>
                          <PopoverTrigger>
                            <button
                              className={
                                'w-[35px] h-[35px] cursor-pointer rounded-full bg-neutral-100 flex items-center justify-center'
                              }
                            >
                              <MoreCircle variant={'Bulk'} size={20} color={'#737C8A'} />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            className={
                              'w-[250px] p-0 m-0 bg-none shadow-none border-none mx-4'
                            }
                          >
                            <ul
                              className={
                                'bg-neutral-100 border border-neutral-200 right-8 p-4  mb-8 rounded-[1rem] shadow-xl bottom-full flex flex-col gap-4'
                              }
                            >
                              <span
                                className={
                                  'font-medium py-[5px] border-b-[1px] border-neutral-200 text-[1.4rem] text-deep-100 leading-[20px]'
                                }
                              >
                                {t('more')}
                              </span>
                              <div className={'flex flex-col gap-4'}>
                                <li className={''}>
                                  <Drawer direction={'right'}>
                                    <DrawerTrigger className={'w-full'}>
                                      <button
                                        className={`font-normal cursor-pointer group text-[1.5rem] py-4 border-b-[1px] border-neutral-200 leading-[20px] text-neutral-700 hover:text-primary-500 flex items-center justify-between w-full`}
                                      >
                                        <span className={''}>{t('details')}</span>
                                        <HambergerMenu
                                          size="20"
                                          variant="Bulk"
                                          color={'#2E3237'}
                                        />
                                      </button>
                                    </DrawerTrigger>
                                    <Informations />
                                  </Drawer>
                                </li>
                                <li className={''}>
                                  <button
                                    className={`font-normal group text-[1.5rem] py-4 leading-[20px] text-neutral-700 hover:text-primary-500 flex items-center justify-between w-full`}
                                  >
                                    <span className={'text-primary-500'}>
                                      {single_event.mark_as_check}
                                    </span>
                                    <TickCircle size="20" variant="Bulk" color={'#E45B00'} />
                                  </button>
                                </li>
                              </div>
                            </ul>
                          </PopoverContent>
                        </Popover>
                      </TableCell> */}
                    </TableRow>
                  )
                }
              )}
            </TableBody>
          </Table>
          {tickets.length === 0 && <div
                className={
                  'w-[330px] lg:w-[460px] mx-auto flex flex-col items-center mt-8 gap-[5rem]'
                }
              >
                <div
                  className={
                    'w-[120px] h-[120px] rounded-full flex items-center justify-center bg-neutral-100'
                  }
                >
                  <div
                    className={
                      'w-[90px] h-[90px] rounded-full flex items-center justify-center bg-neutral-200'
                    }
                  >
                    <Money3 size="50" color="#0d0d0d" variant="Bulk" />
                  </div>
                </div>
                <div className={'flex flex-col gap-[3rem] items-center text-center'}>
                  <p
                    className={
                      'text-[1.8rem] leading-[25px] text-neutral-600 max-w-[330px] lg:max-w-[422px]'
                    }
                  >
                    {t('table.description')}
                  </p>
                </div>
              </div>}
        </TabsContent>
        {event.eventTicketTypes.map((ticketClass, index) => {
          return (
            <TabsContent
              key={ticketClass.ticketTypeName}
              value={ticketClass.ticketTypeName}
              className={'w-full'}
            >
              <Table className={'mt-4'}>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className={
                        'font-bold text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                      }
                    >
                      {t('table.id')}
                    </TableHead>
                    <TableHead
                      className={
                        'font-bold text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                      }
                    >
                      {t('table.name')}
                    </TableHead>
                    <TableHead
                      className={
                        'font-bold hidden lg:table-cell text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                      }
                    >
                      {t('table.ticket_class')}
                    </TableHead>
                    <TableHead
                      className={
                        'font-bold hidden lg:table-cell text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                      }
                    >
                      {t('table.amount')}
                    </TableHead>
                    <TableHead
                      className={
                        'font-bold hidden lg:table-cell text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                      }
                    >
                      {t('table.check')}
                    </TableHead>
                    <TableHead
                      className={
                        'font-bold hidden lg:table-cell text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                      }
                    >
                      {t('table.date_purchased')}
                    </TableHead>
                    <TableHead
                      className={
                        'font-bold hidden lg:table-cell text-[1.1rem] pb-[15px] w-[40px] leading-[15px] text-deep-100 uppercase'
                      }
                    >
                      {/*{single_event.table.date_purchased}*/}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                {/* <TableBody>
                        {tickets
                          .filter((ticket) => ticket.ticketType === ticketClass.name)
                          .map(
                            ({
                              ticketId,
                              ticketName,
                              ticketType,
                              ticketPrice,
                              orderId,
                              createdAt,
                            }) => {
                              const [order] = orders.filter((order) => orderId === order.orderId)
                              return (
                                <TableRow key={ticketId}>
                                  <TableCell
                                    className={'text-[1.5rem] py-[15px] leading-8 text-neutral-900'}
                                  >
                                    <span className={'cursor-pointer'}>{ticketName}</span>
                                  </TableCell>
                                  <TableCell className={'text-[1.5rem] leading-8 text-neutral-900'}>
                                    <span className={'cursor-pointer'}>{ticketName}</span>
                                  </TableCell>
                                  <TableCell className={'hidden lg:table-cell'}>
                                    {ticketType === 'general' && (
                                      <span
                                        className={
                                          'py-[3px] text-[1.1rem] font-bold leading-[15px] text-center uppercase text-[#EF1870]  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                                        }
                                      >
                                        general
                                      </span>
                                    )}
                                    {ticketType === 'vip' && (
                                      <span
                                        className={
                                          'py-[3px] text-[1.1rem] font-bold leading-[15px] text-center uppercase text-[#7A19C7]  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                                        }
                                      >
                                        vip
                                      </span>
                                    )}
                                    {ticketType === 'vvip' && (
                                      <span
                                        className={
                                          'py-[3px] text-[1.1rem] font-bold leading-[15px] text-center uppercase text-deep-100  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                                        }
                                      >
                                        Premium vip
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell
                                    className={
                                      'hidden lg:table-cell text-[1.5rem] font-medium leading-8 text-neutral-900'
                                    }
                                  >
                                    {ticketPrice} HTG
                                  </TableCell>
                                  <TableCell className={'hidden lg:table-cell'}>
                                    {order.status === 'SUCCESSFUL' && (
                                      <span
                                        className={
                                          'py-[3px] text-[1.1rem] font-bold leading-[15px] text-center uppercase text-[#349C2E]  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                                        }
                                      >
                                        {single_event.filters.checked}
                                      </span>
                                    )}
                                    {order.status === 'PENDING' && (
                                      <span
                                        className={
                                          'py-[3px] text-[1.1rem] font-bold leading-[15px] text-center uppercase text-[#EA961C]  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                                        }
                                      >
                                        {single_event.filters.pending}
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell
                                    className={
                                      'hidden lg:table-cell text-[1.5rem] leading-8 text-neutral-900'
                                    }
                                  >
                                    {createdAt.toJSDate().toDateString()}
                                  </TableCell>
                                  <TableCell className={'text-[1.5rem] leading-8 text-neutral-900'}>
                                    <Popover>
                                      <PopoverTrigger>
                                        <button
                                          className={
                                            'w-[35px] h-[35px] cursor-pointer rounded-full bg-neutral-100 flex items-center justify-center'
                                          }
                                        >
                                          <MoreCircle
                                            variant={'Bulk'}
                                            size={20}
                                            color={'#737C8A'}
                                          />
                                        </button>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className={
                                          'w-[250px] p-0 m-0 bg-none shadow-none border-none mx-4'
                                        }
                                      >
                                        <ul
                                          className={
                                            'bg-neutral-100 border border-neutral-200 right-8 p-4  mb-8 rounded-[1rem] shadow-xl bottom-full flex flex-col gap-4'
                                          }
                                        >
                                          <span
                                            className={
                                              'font-medium py-[5px] border-b-[1px] border-neutral-200 text-[1.4rem] text-deep-100 leading-[20px]'
                                            }
                                          >
                                            {single_event.more}
                                          </span>
                                          <div className={'flex flex-col gap-4'}>
                                            <li className={''}>
                                              <Drawer direction={'right'}>
                                                <DrawerTrigger className={'w-full'}>
                                                  <button
                                                    className={`font-normal cursor-pointer group text-[1.5rem] py-4 border-b-[1px] border-neutral-200 leading-[20px] text-neutral-700 hover:text-primary-500 flex items-center justify-between w-full`}
                                                  >
                                                    <span className={''}>
                                                      {single_event.details}
                                                    </span>
                                                    <HambergerMenu
                                                      size="20"
                                                      variant="Bulk"
                                                      color={'#2E3237'}
                                                    />
                                                  </button>
                                                </DrawerTrigger>
                                                <Informations />
                                              </Drawer>
                                            </li>
                                            <li className={''}>
                                              <button
                                                className={`font-normal group text-[1.5rem] py-4 leading-[20px] text-neutral-700 hover:text-primary-500 flex items-center justify-between w-full`}
                                              >
                                                <span className={'text-primary-500'}>
                                                  {single_event.mark_as_check}
                                                </span>
                                                <TickCircle
                                                  size="20"
                                                  variant="Bulk"
                                                  color={'#E45B00'}
                                                />
                                              </button>
                                            </li>
                                          </div>
                                        </ul>
                                      </PopoverContent>
                                    </Popover>
                                  </TableCell>
                                </TableRow>
                              )
                            }
                          )}
                      </TableBody> */}
              </Table>
            </TabsContent>
          )
        })}
      </Tabs>

      {/* no ticket sold */}
      {false && (
        <div
          className={
            'w-[330px] lg:w-[460px] mx-auto flex flex-col items-center mt-8 gap-[5rem]'
          }
        >
          <div
            className={
              'w-[120px] h-[120px] rounded-full flex items-center justify-center bg-neutral-100'
            }
          >
            <div
              className={
                'w-[90px] h-[90px] rounded-full flex items-center justify-center bg-neutral-200'
              }
            >
              <Money3 size="50" color="#0d0d0d" variant="Bulk" />
            </div>
          </div>
          <div className={'flex flex-col gap-[3rem] items-center text-center'}>
            <p
              className={
                'text-[1.8rem] leading-[25px] text-neutral-600 max-w-[330px] lg:max-w-[422px]'
              }
            >
              {t('table.description')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
