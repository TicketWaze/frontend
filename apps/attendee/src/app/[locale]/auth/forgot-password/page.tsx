'use client'
import { LinkAccent } from '@/components/Links'
import { useRouter } from '@/i18n/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { ButtonPrimary } from '@workspace/ui/components/buttons'
import { Input } from '@workspace/ui/components/Inputs'
import LoadingCircleSmall from '@workspace/ui/components/LoadingCircleSmall'
import { useLocale, useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

export default function ForgotPasswordPage() {
  const t = useTranslations('Auth.forgot')
  const ForgotPasswordSchema = z.object({
    email: z.string().min(1, { error: t('errors.email') })
  })
  type TForgotPasswordSchema = z.infer<typeof ForgotPasswordSchema>

  const router = useRouter()

  const locale = useLocale()
  const [host, setHost] = useState<string>('');
  
    useEffect(() => {
      if (typeof window !== "undefined") {
        setHost(window.location.host);
      }
    }, []);

  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<TForgotPasswordSchema>({
    resolver: zodResolver(ForgotPasswordSchema)
  }) 
  async function submitHandler(data: TForgotPasswordSchema) {
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "Accept-Language": locale,
        "Origin": host,
      },
      body: JSON.stringify(data)
    })
    const response = await request.json()

    if (response.status === 'success') {
      router.push(`/auth/forgot-password/${encodeURIComponent(data.email)}`)
    } else {
      toast(response.message)
    }
  }
  return (
    <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col items-center h-full pb-4'>
      <div className='flex-1 flex lg:justify-center flex-col w-full pt-[4.5rem]'>
        <div className='flex flex-col gap-16 items-center'>
          <div className='flex flex-col gap-8 items-center'>
            <h3 className='font-medium font-primary text-[3.2rem] leading-[3.5rem] text-black'>{t('title')}
            </h3>
            <p className='text-[1.8rem] text-center leading-[2.5rem] text-neutral-700'>{t('description')}</p>
          </div>
          <div className=' w-full flex flex-col gap-6'>
            <Input error={errors.email?.message} type='email' {...register("email")}>{t('placeholders.email')}</Input>
          </div>
          <div className='w-full hidden lg:block'>
            <ButtonPrimary type='submit' disabled={isSubmitting} className='w-full'>
              {isSubmitting ? <LoadingCircleSmall /> : t('cta')}
            </ButtonPrimary>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-6'>
        <div
          className={
            'flex items-center  gap-[1.8rem] border border-neutral-100 p-6 rounded-[10rem] mb-8'
          }
        >
          <p
            className={'text-[2.2rem] font-normal leading-[3rem] text-center text-neutral-700'}
          >
            <span className={'text-primary-500'}>2</span>/2
          </p>
          <LinkAccent href='/auth/login'>{t('back')}</LinkAccent>
        </div>
        <ButtonPrimary type='submit' disabled={isSubmitting} className='w-full lg:hidden'>
          {isSubmitting ? <LoadingCircleSmall /> : t('cta')}
        </ButtonPrimary>
      </div>
    </form>
  )
}
