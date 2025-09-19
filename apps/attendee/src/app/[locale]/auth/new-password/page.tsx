'use client'
import { useRouter } from '@/i18n/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { ButtonPrimary } from '@workspace/ui/components/buttons'
import { PasswordInput } from '@workspace/ui/components/Inputs'
import LoadingCircleSmall from '@workspace/ui/components/LoadingCircleSmall'
import { useLocale, useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

export default function NewPasswordPage() {
  const t = useTranslations('Auth.new_password')

  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");

  const NewPasswordSchema = z.object({
    password: z.string().min(8, t("errors.password_length")),
    password_confirmation: z.string().min(8, t("errors.password_length")),
  }).refine(data => data.password === data.password_confirmation, {
    message: t("errors.password_match"),
    path: ["password_confirmation"],
  })
  type TNewPasswordSchema = z.infer<typeof NewPasswordSchema>

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TNewPasswordSchema>({
    resolver: zodResolver(NewPasswordSchema)
  })

  const [host, setHost] = useState<string>('');

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHost(window.location.host);
    }
  }, []);

  const locale = useLocale()

  const router = useRouter()


  async function submitHandler(data: TNewPasswordSchema) {
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/new-password`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "Accept-Language": locale,
        "Origin": host,
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(data)
    })
    
    const response = await request.json()

    if (response.status === 'success') {
      router.push('/auth/login')
    } else {
      toast.error(response.message)
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
            <PasswordInput error={errors.password?.message} {...register("password")}>{t('placeholders.password')}</PasswordInput>
            <PasswordInput error={errors.password_confirmation?.message} {...register("password_confirmation")}>{t('placeholders.confirm')}</PasswordInput>
          </div>
          <div className='w-full hidden lg:block'>
            <ButtonPrimary type='submit' disabled={isSubmitting} className='w-full'>
              {isSubmitting ? <LoadingCircleSmall /> : t('cta')}
            </ButtonPrimary>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-6'>
        <ButtonPrimary type='submit' disabled={isSubmitting} className='w-full lg:hidden'>
          {isSubmitting ? <LoadingCircleSmall /> : t('cta')}
        </ButtonPrimary>
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
          {/* <LinkAccent href='/auth/login'>{t('back')}</LinkAccent> */}
        </div>
      </div>
    </form>
  )
}
