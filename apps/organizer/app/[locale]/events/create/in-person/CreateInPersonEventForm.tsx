'use client'
import React, { useCallback, useEffect, useRef } from 'react'
import BackButton from '@workspace/ui/components/BackButton'
import { useTranslations } from 'next-intl'
import { Input } from '@workspace/ui/components/Inputs'
import { ButtonPrimary } from '@workspace/ui/components/buttons'
import { AddCircle, ArrowLeft2, DocumentUpload, Trash } from 'iconsax-react'
import { Select as UISelect, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@workspace/ui/components/select'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog'
import Cropper from 'react-easy-crop'
import getCroppedImg from '@/lib/GetCroppedImage'
import Select from 'react-select'
import UseCountries from '@/hooks/UseCountries'
import ToggleIcon from '@workspace/ui/components/ToggleIcon'

import { useState } from 'react'
import { motion } from 'framer-motion'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { CreateInPersonEvent } from '@/actions/EventActions'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import EventTag from '@/types/EventTag'
import Capitalize from '@workspace/ui/lib/Capitalize'
import LoadingCircleSmall from '@workspace/ui/components/LoadingCircleSmall'
import { redirect } from 'next/navigation'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


export default function CreateInPersonEventForm({ tags }: { tags: EventTag[] }) {
  const t = useTranslations('Events.create_event')
  const { data: session } = useSession()
  const organisation = session?.activeOrganisation
  const countries = UseCountries()
  const [isFree, setIsfree] = useState(true)

  const FormDataSchema = z.object({
    eventName: z.string().min(10, t('errors.basicDetails.name')).max(50).regex(/^[a-zA-Z0-9 ]+$/, {
      message: t('errors.basicDetails.no_special'),
    }),
    eventDescription: z.string()
      .min(150, t('errors.basicDetails.description.min'))
      .max(350, t('errors.basicDetails.description.max')),
    address: z.string().min(1, t('errors.basicDetails.address')),
    state: z.string().min(1, t('errors.basicDetails.state')),
    city: z.string().min(1, t('errors.basicDetails.city')),
    country: z.string({ error: issue => issue.input === undefined ? t('errors.basicDetails.country') : t('errors.basicDetails.country') })
      .min(1, t('errors.basicDetails.country')),
    longitude : z.string().min(3, t('errors.basicDetails.longitude')),
    latitude : z.string(),
    eventTags: z.array(z.object({ tagId: z.string(), tagName: z.string() }), { error: issue => issue.input === undefined ? t('errors.basicDetails.tags') : t('errors.basicDetails.tags') }).min(1, t('errors.basicDetails.tags')),
    eventImage: z
      .file({ error: issue => issue.input === undefined ? t('errors.basicDetails.image.required') : t('errors.basicDetails.image.required') })
      .max(504800, t('errors.basicDetails.image.max'))
      .mime(['image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',]),
    eventDays: z.array(z.object(
      {
        startDate: z.string().min(1, t('errors.dateAndTime.startDate')),
        startTime: z.string().min(1, t('errors.dateAndTime.startTime')),
        endTime: z.string().optional()
      })),
    ticketTypes: z.array(z.object({
      ticketTypeName: z.string().min(1, t('errors.ticketClass.name')),
      ticketTypeDescription: z.string().min(20, t('errors.ticketClass.description')).max(100),
      ticketTypePrice: isFree ? z.string() : z.string().min(1, t('errors.ticketClass.price')),
      ticketTypeQuantity: z.string().min(1, t('errors.ticketClass.quantity.empty')).refine((val) => /^[1-9]\d*$/.test(val), {
        message: t('errors.ticketClass.quantity.decimal'),
      }),
    }))
  })
  type TInpuFormDataSchema = z.infer<typeof FormDataSchema>

  const steps = [
    {
      name: t('basic'),
      fields: ['eventName', 'eventDescription', 'address', 'state', 'city', 'country', 'longitude', 'latitude', 'eventTags', 'eventImage']
    },
    {
      name: t('date_time'),
      fields: ['eventDays']
    },
    { name: t('ticket'), fields: ['ticketTypes'] }
  ]

  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const delta = currentStep - previousStep

  const [wordCount, setWordCount] = useState(0)
  const handleWordCount = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWordCount(e.target.value.length)
  }, [])

  const [ticketClassDescriptionWordCount, setTicketClassDescriptionWordCount] = useState(0)
  const handleTicketClassWordCount = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTicketClassDescriptionWordCount(e.target.value.length)
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm<TInpuFormDataSchema>({
    resolver: zodResolver(FormDataSchema),
    values: {
      eventName: '',
      eventDescription: '',
      address: '',
      state: '',
      city: '',
      country: Capitalize(organisation?.country ?? ''),
      longitude : '',
      latitude: '',
      eventTags : [],
      eventImage: undefined as unknown as File,
      eventDays: [{ startDate: '', startTime: '', endTime: '' }],
      ticketTypes: [{ ticketTypeName: '', ticketTypeDescription: '', ticketTypePrice: '', ticketTypeQuantity: '' }]
    }
  })

  const processForm: SubmitHandler<TInpuFormDataSchema> = async data => {
    const formData = new FormData()
    formData.append('eventName', data.eventName)
    formData.append('eventDescription', data.eventDescription)
    formData.append('address', data.address)
    formData.append('state', data.state)
    formData.append('city', data.city)
    formData.append('country', data.country)
    formData.append('longitude', data.longitude)
    formData.append('latitude', data.latitude)
    formData.append('eventTags', JSON.stringify(data.eventTags))
    formData.append('eventImage', data.eventImage)
    formData.append('eventDays', JSON.stringify(data.eventDays))
    formData.append('currency', session?.user.currency.isoCode ?? '')

    if (isFree) {
      formData.append('ticketTypes', JSON.stringify([
        {
          ticketTypeName: 'general',
          ticketTypeDescription: t('general_default'),
          ticketTypePrice: '',
          ticketTypeQuantity: '100'
        }
      ]
      ))
    } else {
      formData.append('ticketTypes', JSON.stringify(data.ticketTypes))
    }

    formData.append('currencyId', session?.user.currency.currencyId ?? '')

    const result = await CreateInPersonEvent(organisation?.organisationId ?? '', session?.user.accessToken ?? '', formData)
    if (result.status === 'success') {
      toast.success('success')
      redirect('/events')
    }
    if (result.error) {
      toast.error(result.error)
    }
  }

  type FieldName = keyof TInpuFormDataSchema

  const next = async () => {
    const fields = steps[currentStep]?.fields
    const output = await trigger(fields as FieldName[], { shouldFocus: true })

    if (!output) return

    if (currentStep === steps.length - 1) {
      // ✅ Final step – submit the form
      await handleSubmit(processForm)()
      return
    }
    setPreviousStep(currentStep)
    setCurrentStep(step => step + 1)
  }

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step - 1)
    }
  }

  // Image Handling Start
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)

  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    triggerRef.current?.click()
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setImageSrc(reader.result as string)
    }
  }

  async function cropImage() {
    if (!imageSrc || !croppedAreaPixels) return
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
    const file = new File([croppedBlob], 'profile.jpg', { type: croppedBlob.type })
    setValue('eventImage', file, { shouldValidate: true })
    setImagePreview(URL.createObjectURL(file))
  }

  // Image handling ends


  // handling event Days start
  const [eventDays, setEventDays] = useState<{ startDate: string; startTime: string, endTime: string }[]>([{ startDate: '', startTime: '', endTime: '' }])
  // handling event Days end

  // handling ticketClasses start
  const [ticketClasses, setTicketClasses] = useState<{ ticketTypeName: string, ticketTypeDescription: string, ticketTypePrice: string, ticketTypeQuantity: string }[]>([{ ticketTypeName: '', ticketTypeDescription: '', ticketTypePrice: '', ticketTypeQuantity: '' }])
  const updateTicketClasses = (
    index: number,
    key: 'ticketTypeName' | 'ticketTypeDescription' | 'ticketTypePrice' | 'ticketTypeQuantity',
    value: string
  ) => {
    const updated = [...ticketClasses]

    // Fill missing fields if undefined (to satisfy strict types)
    const current = updated[index] ?? { ticketTypeName: '', ticketTypeDescription: '', ticketTypePrice: '', ticketTypeQuantity: '' }

    updated[index] = {
      ticketTypeName: current.ticketTypeName,
      ticketTypeDescription: current.ticketTypeDescription,
      ticketTypePrice: current.ticketTypePrice,
      ticketTypeQuantity: current.ticketTypeQuantity,
      [key]: value
    }

    setTicketClasses(updated)
    setValue('ticketTypes', updated, { shouldValidate: true })
  }

  // MAP HANDLING

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const position: [number, number] = [-72.2852, 18.9712];


  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN

    mapRef.current = new mapboxgl.Map({
      // @ts-ignore
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11', // add style
      center: position, // starting position [lng, lat]
      zoom: 6, // starting zoom
      attributionControl: false,
    });
    // listen for map click
    mapRef.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      setValue('longitude', String(lng))
      setValue('latitude', String(lat))

      // If a marker exists, update it; else create one
      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat]);
      } else {
        markerRef.current = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([lng, lat])
          .addTo(mapRef.current!);
      }

      // console.log('Clicked coordinates:', lng, lat);
    });

  }, []);

  // handling ticketClasses ends
  return (
    <div className='relative flex flex-col gap-8 overflow-hidden '>
      {/* Navigation */}
      <div className='absolute bottom-4 z-50 w-full hidden lg:block'>
        <ButtonPrimary
          onClick={next}
          className=' w-full max-w-[530px] mx-auto  '
          disabled={isSubmitting}
        >
          {isSubmitting ? <LoadingCircleSmall /> : t('proceed')}
        </ButtonPrimary>
      </div>
      <div className='fixed lg:hidden bottom-36 w-full px-8 z-50 left-0'>
        <div
          className={
            ' lg:hidden bg-white mx-auto border border-neutral-100 px-4 py-[5px] flex justify-between items-center rounded-[100px]'
          }
        >
          <div className={'text-[2.2rem] text-neutral-600'}>
            <span className={'text-primary-500'}>{currentStep + 1}</span>/3
          </div>
          <ButtonPrimary onClick={next}>
            {t('proceed')}
          </ButtonPrimary>
        </div>
      </div>
      {currentStep === 0 ?
        <BackButton text={t('back')}>
          <div className={'flex justify-between'}>
            <div className={'hidden lg:flex items-center gap-4'}>
              <span className={'text-primary-500 font-medium text-[1.5rem] leading-[3rem] '}>
                {t('basic')}
              </span>
              <div className={'w-[161px] h-[5px] rounded-[100px] bg-neutral-100'}></div>
              <span className={'text-neutral-500 font-medium text-[1.5rem] leading-[3rem] '}>
                {t('date_time')}
              </span>
              <div className={'w-[161px] h-[5px] rounded-[100px] bg-neutral-100'}></div>
              <span className={'text-neutral-500 font-medium text-[1.5rem] leading-[3rem] '}>
                {t('ticket')}
              </span>
            </div>
          </div>
        </BackButton> :
        <div className='flex items-center justify-between'>
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
          <div className={'hidden lg:flex items-center gap-4'}>
            <span className={'text-primary-500 font-medium text-[1.5rem] leading-[3rem] '}>
              {t('basic')}
            </span>
            <div className={'w-[161px] h-[5px] rounded-[100px] bg-primary-500'}></div>
            <span className={'text-primary-500 font-medium text-[1.5rem] leading-[3rem] '}>
              {t('date_time')}
            </span>
            <div className={`w-[161px] h-[5px] rounded-[100px] ${currentStep === 2 ? 'bg-primary-500' : 'bg-neutral-100'}`}></div>
            <span className={`${currentStep === 2 ? "text-primary-500" : 'text-neutral-500'} font-medium text-[1.5rem] leading-[3rem]`}>
              {t('ticket')}
            </span>
          </div>
        </div>
      }

      <Dialog>
        <DialogTrigger asChild className='hidden' ><span ref={triggerRef} className='hidden'>open</span></DialogTrigger>
        <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{t('resize')}</DialogTitle>
            <DialogDescription className='sr-only'>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </DialogDescription>
            {imageSrc && (
              <div className="relative w-full h-[300px]">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
            )}
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild onClick={cropImage}><span className='bg-primary-500 disabled:bg-primary-500/50 hover:bg-primary-500/80 hover:border-primary-600 px-[3rem] py-[15px] border-2 border-transparent rounded-[100px] text-center text-white font-medium text-[1.5rem] h-auto leading-[20px] cursor-pointer transition-all duration-400 flex items-center justify-center w-full'>{t('resize')}</span></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <form className=' flex flex-col gap-12 h-full overflow-y-scroll' onSubmit={handleSubmit(processForm)}>
        {/* Event details */}
        {currentStep === 0 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            layout={false}
            className='flex flex-col gap-12  '
          >
            <div
              className={
                'p-[15px] max-w-[540px] w-full mx-auto rounded-[15px] flex flex-col gap-[15px] border border-neutral-100'
              }
            >
              <span className={'font-semibold text-[16px] leading-[22px] text-deep-100'}>
                {t('event_details')}
              </span>
              <Input {...register('eventName')} type='text' maxLength={50} error={errors.eventName?.message}>{t('event_name')}</Input>
              <div>
                <textarea
                  {...register('eventDescription')}
                  className={
                    'bg-neutral-100 w-full rounded-[2rem] h-[150px] resize-none p-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500'
                  }
                  placeholder={t('description')}
                  minLength={150}
                  maxLength={350}
                  onChange={handleWordCount}
                />
                <div className='flex items-center justify-between'>
                  <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
                    {errors.eventDescription?.message}
                  </span>
                  {wordCount > 0 && <span className={`text-[1.2rem] px-8 py-2 ${wordCount < 150 ? 'text-failure' : 'text-success'}`}>{wordCount} / 350</span>}
                </div>
              </div>
            </div>
            {/* location */}
            <div
              className={
                'max-w-[540px] w-full mx-auto p-[15px] rounded-[15px] flex flex-col gap-[15px] border border-neutral-100'
              }
            >
              <span className={'font-semibold text-[16px] leading-[22px] text-deep-100'}>
                {t('location')}
              </span>
              <Input {...register('address')} type='text' error={errors.address?.message}>{t('address')}</Input>
              <div className='flex flex-col lg:flex-row w-full gap-[15px] items-center justify-between'>
                <Input {...register('state')} type='text' error={errors.state?.message} className='w-full'>{t('state')}</Input>
                <Input {...register('city')} type='text' error={errors.city?.message} className='w-full'>{t('city')}</Input>
              </div>
              <div>
                <Controller
                  control={control}
                  name="country"
                  render={({ field }) => (
                    <UISelect
                      {...field}
                      value={field.value}
                      onValueChange={field.onChange}
                      defaultValue={Capitalize(organisation?.country ?? '')}
                    >
                      <SelectTrigger className="bg-neutral-100 w-full rounded-[5rem] p-12 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border border-transparent focus:border-primary-500 z">
                        <SelectValue placeholder={t('country')} />
                      </SelectTrigger>
                      <SelectContent>
                        {countries?.map((country, i) => {
                          return (
                            <SelectItem
                              key={i}
                              className={
                                'text-[1.5rem] leading-[20px] border-b border-neutral-100 mb-3 pb-3'
                              }
                              value={country.name.common}
                            >
                              {country.name.common}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </UISelect>
                  )}
                />
                <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
                  {errors.country?.message}
                </span>
              </div>
              <Input defaultValue={`${getValues('longitude')} - ${getValues('latitude')}`} error={errors.longitude?.message} disabled readOnly>{t('coordinates')}</Input>
              <div className='w-full h-[300px] relative'>
                <div
                  style={{ height: '100%' }}
                  ref={mapContainerRef}
                  className="map-container"
                />
              </div>
            </div>
            {/* tags */}
            <div
              className={
                'max-w-[540px] w-full mx-auto p-[15px] rounded-[15px] flex flex-col gap-[15px] border border-neutral-100'
              }
            >
              <span className={'font-semibold text-[16px] leading-[22px] text-deep-100'}>
                {t('event_tags')}
              </span>
              <div>
                <Controller
                  control={control}
                  name="eventTags"
                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti
                      options={tags}
                      placeholder={t('event_tags')}
                      styles={{ control: () => ({ borderColor: 'transparent', display: 'flex' }) }}
                      getOptionLabel={(option) => option.tagName}
                      getOptionValue={(option) => option.tagId}
                      className={
                        'bg-neutral-100 w-full rounded-[5rem] p-4 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500'
                      }
                    />
                  )}
                />
                <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
                  {errors.eventTags?.message}
                </span>
              </div>
            </div>
            {/* image */}
            <div
              className={
                'max-w-[540px] w-full mx-auto p-[15px] rounded-[15px] flex flex-col gap-[15px] border border-neutral-100'
              }
            >
              <span className={'font-semibold text-[16px] leading-[22px] text-deep-100'}>
                {t('thumbnail')}
              </span>

              {imagePreview ? (
                <div className={'relative w-full h-[300px]'}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-[300px] object-cover object-top rounded-[1rem]"
                  />
                  <input
                    type={'file'}
                    accept={'image/*'}
                    onChange={handleFileChange}
                    className={'absolute top-0 left-0 w-full h-full z-50 opacity-0 cursor-pointer'}
                  />
                </div>
              ) : (
                <div
                  className={
                    'py-[6rem] px-[1.4rem] rounded-[7px] border border-[#e5e5e5] border-dashed bg-[#FBFBFB] flex items-center justify-center relative'
                  }
                >
                  <div className={'flex flex-col items-center gap-4 '}>
                    <DocumentUpload size={30} color={'#E45B00'} variant={'Bulk'} />
                    <p className={'text-[1.5rem] leading-[20px] text-neutral-500 '}>
                      {t('thumbnail_text')}{' '}
                      <span className={'font-medium text-primary-500'}>{t('browse')}</span>
                    </p>
                    <input
                      type={'file'}
                      accept={'image/*'}
                      onChange={handleFileChange}
                      className={'absolute top-0 left-0 w-full h-full z-50 opacity-0 cursor-pointer'}
                    />
                  </div>
                </div>
              )}

              <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
                {errors.eventImage?.message}
              </span>
            </div>
            <div></div>
            {/* </div> */}
          </motion.div>
        )}


        {/* Event Days */}
        {currentStep === 1 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='flex flex-col gap-12'>
            {eventDays.map((eventDay, index) => {
              return (
                <div
                  key={index}
                  className="max-w-[540px] w-full h-full mx-auto p-[15px] rounded-[15px] flex flex-col gap-[15px] border border-neutral-100"
                >
                  <div className={'flex items-center justify-between'}>
                    <span className="font-semibold text-[16px] leading-[22px] text-deep-100">
                      {t('day')}{' '}
                      {index + 1}
                    </span>
                    {index > 0 && (
                      <Trash
                        variant={'Bulk'}
                        color={'#DE0028'}
                        className={'cursor-pointer'}
                        onClick={() => {
                          const updated = eventDays.filter((_, i) => i !== index)
                          setValue('eventDays', updated, { shouldValidate: true })
                          setEventDays(updated)
                        }}
                        size={20}
                      />
                    )}
                  </div>

                  <div>
                    <div
                      className={
                        'bg-neutral-100 w-full rounded-[5rem] py-4 px-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500'
                      }
                    >
                      <span className={'text-neutral-600 text-[1.2rem]'}>{t('start_date')}</span>
                      <input
                        type={'date'}
                        className={'w-full outline-none'}
                        {...register(`eventDays.${index}.startDate`)}
                      />
                    </div>
                    <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
                      {errors.eventDays?.[index]?.startDate?.message}
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-col lg:flex-row w-full items-center gap-4">
                      <div className='flex-1 w-full'>
                        <div
                          className={
                            'bg-neutral-100 w-full rounded-[5rem] py-4 px-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500'
                          }
                        >
                          <span className={'text-neutral-600 text-[1.2rem]'}>{t('start_time')}</span>
                          <input
                            type={'time'}
                            className={'w-full outline-none'}
                            {...register(`eventDays.${index}.startTime`)}
                          />
                        </div>
                        <span className={"text-[1.2rem] lg:hidden px-8 py-2 text-failure"}>
                          {errors.eventDays?.[index]?.startTime?.message}
                        </span>
                      </div>

                      <div
                        className={
                          'bg-neutral-100 w-full flex-1 rounded-[5rem] py-4 px-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500'
                        }
                      >
                        <span className={'text-neutral-600 text-[1.2rem]'}>{t('end_time')}</span>
                        <input
                          type={'time'}
                          className={'w-full outline-none'}
                          {...register(`eventDays.${index}.endTime`)}
                        />
                      </div>
                    </div>
                    <span className={"text-[1.2rem] lg:block hidden px-8 py-2 text-failure"}>
                      {errors.eventDays?.[index]?.startTime?.message}
                    </span>
                  </div>
                  <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
                    {errors.eventDays?.message}
                  </span>
                </div>
              )
            })}
            <div className='w-full max-w-[540px] mx-auto flex justify-between '>
              <div></div>
              <button
                onClick={() => setEventDays(prev => [...prev, { startDate: '', startTime: '', endTime: '' }])}
                className=" cursor-pointer flex gap-4 items-center"
              >
                <AddCircle color={'#E45B00'} variant={'Bulk'} size={'20'} />
                <span className="text-[1.5rem] leading-8 text-primary-500">{t('add_day')}</span>
              </button>
            </div>
            <div></div>
          </motion.div>
        )}

        {/* Ticket Classes */}

        {currentStep === 2 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='flex flex-col gap-12'>
            {/* mark as free */}
            <div className="max-w-[540px] w-full mx-auto p-[15px] rounded-[15px] flex flex-col gap-[15px] border border-neutral-100">
              <div className={'flex items-center justify-between'}>
                <p className={'text-[1.6rem] leading-[22px] text-deep-100 max-w-[380px]'}>
                  {t('mark_as_free')}
                </p>
                <label className="relative inline-block h-[30px] w-[50px] cursor-pointer rounded-full bg-neutral-600 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-primary-500">
                  <input
                    className="peer sr-only"
                    id="free-event"
                    type="checkbox"
                    onChange={() => setIsfree(prev => {
                      if (prev === true) {
                        setValue('ticketTypes', [{ ticketTypeName: '', ticketTypeDescription: '', ticketTypePrice: '', ticketTypeQuantity: '' }])
                      } else {
                        setValue('ticketTypes', [{
                          ticketTypeName: 'general',
                          ticketTypeDescription: t('general_default'),
                          ticketTypePrice: '',
                          ticketTypeQuantity: '100'
                        }])
                      }
                      return !prev
                    })}
                  />
                  <ToggleIcon />
                </label>
              </div>
            </div>
            {isFree &&
              <div
                className="max-w-[540px] w-full mx-auto p-[15px] rounded-[15px] flex flex-col gap-[15px] border border-neutral-100"
              >
                <div className={'flex items-center justify-between'}>
                  <span className="font-semibold text-[16px] leading-[22px] text-deep-100">
                    {t('ticket_class')}
                  </span>
                </div>
                <Input defaultValue={'General'} disabled readOnly>{t('class_name')}</Input>
                <textarea
                  className={
                    'h-[150px] resize-none bg-neutral-100 w-full rounded-[2rem] p-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500 '
                  }
                  placeholder={t('general_default')}
                  disabled
                  readOnly
                />
                <div className={'flex flex-col lg:flex-row gap-4'}>
                  <Input defaultValue={'Free'} disabled readOnly>{t('price')}</Input>
                  <Input defaultValue='100' readOnly disabled>{t('quantity')}</Input>
                </div>
              </div>
            }

            {!isFree && ticketClasses.map((_, index) => {
              return (
                <div
                  key={index}
                  className="max-w-[540px] w-full mx-auto p-[15px] rounded-[15px] flex flex-col gap-[15px] border border-neutral-100"
                >
                  <div className={'flex items-center justify-between'}>
                    <span className="font-semibold text-[16px] leading-[22px] text-deep-100">
                      {t('ticket_class')}
                    </span>
                    {index > 0 && (
                      <Trash
                        variant={'Bulk'}
                        color={'#DE0028'}
                        className={'cursor-pointer'}
                        onClick={() => {
                          const updated = ticketClasses.filter((_, i) => i !== index)
                          setValue('ticketTypes', updated, { shouldValidate: true })
                          setTicketClasses(updated)
                        }}
                        size={20}
                      />
                    )}
                  </div>
                  <UISelect onValueChange={e => setValue(`ticketTypes.${index}.ticketTypeName`, e)}>
                    <SelectTrigger className="bg-neutral-100 w-full rounded-[5rem] p-12 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border border-transparent focus:border-primary-500 z">
                      <SelectValue placeholder={t('class_name')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value={'general'}
                        className="text-[1.5rem] leading-[20px] border-b border-neutral-100 mb-3 pb-3"
                      >
                        General
                      </SelectItem>
                      <SelectItem
                        value={'vip'}
                        className="text-[1.5rem] leading-[20px] border-b border-neutral-100 mb-3 pb-3"
                      >
                        VIP
                      </SelectItem>
                      <SelectItem
                        value={'vvip'}
                        className="text-[1.5rem] leading-[20px] border-b border-neutral-100 mb-3 pb-3"
                      >
                        Premium VIP
                      </SelectItem>
                    </SelectContent>
                  </UISelect>
                  <div className=''>
                    <textarea
                      className={
                        'h-[150px] resize-none bg-neutral-100 w-full rounded-[2rem] p-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500 '
                      }
                      placeholder={t('class_description')}
                      {...register(`ticketTypes.${index}.ticketTypeDescription`)}
                      onChange={handleTicketClassWordCount}
                      maxLength={100}
                      minLength={20}
                    />
                    <div className='flex items-center justify-between'>
                      <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
                        {errors && errors.ticketTypes?.[index]?.ticketTypeDescription?.message}
                      </span>
                      {ticketClassDescriptionWordCount > 0 && <span className={`text-[1.2rem] self-end px-8 py-2 ${ticketClassDescriptionWordCount < 20 ? 'text-failure' : 'text-success'}`}>{ticketClassDescriptionWordCount} / 100</span>}
                    </div>
                  </div>
                  <div className={'flex flex-col lg:flex-row gap-4'}>
                    <div className='flex-1'>
                      <div
                        className={
                          'flex-1 bg-neutral-100 w-full rounded-[5rem] p-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500 flex gap-2'
                        }
                      >
                        <input
                          className={'outline-none'}
                          type="number"
                          placeholder={`${t('price')}`}
                          {...register(`ticketTypes.${index}.ticketTypePrice`)}
                        />
                        <span>{session?.user.currency.isoCode}</span>
                      </div>
                      <span className={"text-[1.2rem] lg:hidden px-8 py-2 text-failure"}>
                        {errors.ticketTypes?.[index]?.ticketTypePrice?.message}
                      </span>
                    </div>

                    <div className='flex-1'>
                      <input
                        className={
                          'flex-1 bg-neutral-100 w-full rounded-[5rem] p-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500'
                        }
                        type="number"
                        step={'1'}
                        placeholder={t('quantity')}
                        {...register(`ticketTypes.${index}.ticketTypeQuantity`)}
                      />
                      <span className={"text-[1.2rem] lg:hidden px-8 py-2 text-failure"}>
                        {errors.ticketTypes?.[index]?.ticketTypeQuantity?.message}
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className={"text-[1.2rem] flex-1 hidden lg:block px-8 py-2 text-failure"}>
                      {errors.ticketTypes?.[index]?.ticketTypePrice?.message}
                    </span>
                    <span className={"text-[1.2rem] flex-1 hidden lg:block px-8 py-2 text-failure"}>
                      {errors.ticketTypes?.[index]?.ticketTypeQuantity?.message}
                    </span>
                  </div>
                </div>
              )
            })}
            {!isFree && <div className='w-full max-w-[540px] mx-auto flex justify-between '>
              <div></div>
              <button
                onClick={() => setTicketClasses(prev => [...prev, { ticketTypeName: '', ticketTypeDescription: '', ticketTypePrice: '', ticketTypeQuantity: '' }])}
                className=" cursor-pointer flex gap-4 items-center"
              >
                <AddCircle color={'#E45B00'} variant={'Bulk'} size={'20'} />
                <span className="text-[1.5rem] leading-8 text-primary-500">{t('add_class')}</span>
              </button>
            </div>}
          </motion.div>
        )}
        <div></div>
        <div></div>
        <div></div>
      </form>
    </div>
  )
}
