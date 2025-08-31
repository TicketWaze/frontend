'use client'
import UseCountries from '@/hooks/UseCountries'
import { useRouter } from '@/i18n/navigation'
import Currency from '@/types/Currency'
import { zodResolver } from '@hookform/resolvers/zod'
import { ButtonAccent, ButtonPrimary } from '@workspace/ui/components/buttons'
import { Input } from '@workspace/ui/components/Inputs'
import LoadingCircleSmall from '@workspace/ui/components/LoadingCircleSmall'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

export default function NewOrganisationPage() {
  const t = useTranslations('Auth.complete.becoming')
  const { data: session } = useSession()

  const [currencies, setCurrencies] = useState<Currency[] | undefined>()

  useEffect(function () {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/currencies`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },

    }).then(res => res.json()).then(res => setCurrencies(res.currencies))
  }, [])

  const CreateOrganisationSchema = z.object({
    organisationName: z.string().min(1, t('errors.name.min')).max(30, t('errors.name.max')),
    country: z.string({ error: t('errors.country') }),
    state: z.string().min(1, t('errors.state')),
    city: z.string().min(1, t('errors.city')),
    organisationDescription: z.string().min(150, t('errors.description.min')).max(350, t('errors.description.max')),
    website: z.string().optional(),
    currencyId: z.string(t('errors.currency'))
  })
  type TCreateOrganisationSchema = z.infer<typeof CreateOrganisationSchema>

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<TCreateOrganisationSchema>({
    resolver: zodResolver(CreateOrganisationSchema)
  })

  const countries = UseCountries()
  const router = useRouter()

  const [ticketClassDescriptionWordCount, setTicketClassDescriptionWordCount] = useState(0)
  const handleTicketClassWordCount = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTicketClassDescriptionWordCount(e.target.value.length)
  }, [])

  async function submitHandler(data: TCreateOrganisationSchema) {
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organisations`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${session?.user.accessToken}`
      },
      body: JSON.stringify(data)
    })
    const response = await request.json()
    
    if (response.status === 'success') {
      router.push('/analytics')
    } else {
      toast.error(response.message)
    }
  }
  return (
    <div
      className='flex flex-col items-center justify-between gap-20 w-full h-full pb-4 '
    >
      <form onSubmit={handleSubmit(submitHandler)} className={'flex flex-col gap-16 w-full'}>
        <div className='flex-1 flex lg:justify-center flex-col w-full pt-[4.5rem]'>
          <div className='flex flex-col gap-16 items-center'>
            <div className='flex flex-col gap-8 items-center'>
              <h3 className='font-medium font-primary text-[3.2rem] leading-[3.5rem] text-black'>{t('subtitle')}
              </h3>
              <p className='text-[1.8rem] text-center leading-[2.5rem] text-neutral-700'>{t('description')}</p>
            </div>
            <div className=' w-full flex flex-col gap-6'>
              <Input {...register('organisationName')} type='text' error={errors.organisationName?.message}>{t('name')}</Input>
              <div>
                <Select onValueChange={(e) => setValue('country', e)}>
                  <SelectTrigger className="bg-neutral-100 cursor-pointer rounded-[3rem] px-8 border-none w-full py-12 text-[1.4rem] text-neutral-700 leading-[20px]">
                    <SelectValue placeholder={t('country')} />
                  </SelectTrigger>
                  <SelectContent className={'bg-neutral-100 text-[1.4rem]'}>
                    <SelectGroup>
                      {countries &&
                        countries?.map((country, i) => {
                          return (
                            <SelectItem
                              className={'text-[1.4rem] text-deep-100'}
                              key={i}
                              value={country.name.common}
                            >
                              {country.name.common}
                            </SelectItem>
                          )
                        })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.country && (
                  <span className={'text-[1.2rem] px-8 py-2 text-failure'}>{errors.country.message}</span>
                )}
              </div>
              <div className={'flex gap-[1.5rem]'}>
                <Input {...register('state')} type='text' error={errors.state?.message}>{t('state')}</Input>
                <Input {...register('city')} type='text' error={errors.city?.message}>{t('city')}</Input>
              </div>

              <div className=''>
                <textarea
                  className={
                    'h-[150px] resize-none bg-neutral-100 w-full rounded-[2rem] p-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500 '
                  }
                  placeholder={t('organisationDescription')}
                  {...register(`organisationDescription`)}
                  onChange={handleTicketClassWordCount}
                  maxLength={350}
                  minLength={150}
                />
                <div className='flex items-center justify-between'>
                  <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
                    {errors.organisationDescription && errors.organisationDescription.message}
                  </span>
                  {ticketClassDescriptionWordCount > 0 && <span className={`text-[1.2rem] self-end px-8 py-2 ${ticketClassDescriptionWordCount < 150 ? 'text-failure' : 'text-success'}`}>{ticketClassDescriptionWordCount} / 350</span>}
                </div>
              </div>
              <div>
                <Select onValueChange={(e) => setValue('currencyId', e)}>
                  <SelectTrigger className="bg-neutral-100 cursor-pointer rounded-[3rem] px-8 border-none w-full py-12 text-[1.4rem] text-neutral-700 leading-[20px]">
                    <SelectValue placeholder={t('currency')} />
                  </SelectTrigger>
                  <SelectContent className={'bg-neutral-100 text-[1.4rem]'}>
                    <SelectGroup>
                      {currencies?.map(currency => {
                        return (
                          <SelectItem key={currency.currencyId} className={'text-[1.4rem] text-deep-100'} value={currency.currencyId}>
                            {currency.isoCode} - {currency.currencyName}
                          </SelectItem>
                        )
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.currencyId && (
                  <span className={'text-[1.2rem] px-8 py-2 text-failure'}>{errors.currencyId.message}</span>
                )}
              </div>
              <Input {...register('website')} type='text' error={errors.website?.message}>{t('website')}</Input>
            </div>
            <div className='w-full hidden lg:block'>
              <ButtonPrimary
                disabled={isSubmitting}
                type={'submit'}
                className={'w-full disabled:opacity-50 disabled:cursor-not-allowed '}
              >
                {isSubmitting ? <LoadingCircleSmall /> : t('submit')}
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </form>
      <div
        className={
          'flex items-center justify-between gap-[1.8rem] border border-neutral-100  p-4 rounded-[10rem] mb-8'
        }
      >
        <ButtonAccent
          onClick={() => router.back()}
          className={
            'border-2 border-primary-500 px-[3rem] py-6 rounded-[10rem] font-normal text-primary-500 text-[1.5rem] leading-[20px] bg-primary-100'
          }
        >
          {t('back')}
        </ButtonAccent>
      </div>
    </div>
  )
}
