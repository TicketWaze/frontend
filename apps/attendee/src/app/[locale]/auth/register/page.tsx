'use client'
import { Link, useRouter } from '@/i18n/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { ButtonPrimary } from '@workspace/ui/components/buttons'
import { Input, PasswordInput } from '@workspace/ui/components/Inputs'
import LoadingCircleSmall from '@workspace/ui/components/LoadingCircleSmall'
import { useLocale, useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

export default function RegisterPage() {
  const t = useTranslations('Auth.register')

  const RegisterSchema = z.object({
    firstName: z.string().min(2, { error: t('errors.firstname_length') }),
    lastName: z.string().min(2, { error: t('errors.lastname_length') }),
    email: z.string().min(1, { error: t('errors.email') }),
    password: z.string().min(8, { error: t('errors.password_length') }),
    password_confirmation: z.string().min(8, { error: t('errors.password_length') }),
  }).refine(data => data.password === data.password_confirmation, {
    message: t("errors.password_match"),
    path: ["password_confirmation"],
  })
  type TRegisterSchema = z.infer<typeof RegisterSchema>

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TRegisterSchema>({
    resolver: zodResolver(RegisterSchema)
  })

  const router = useRouter()

  const locale = useLocale()
  const [host, setHost] = useState<string>('');

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHost(window.location.host);
    }
  }, []);

  async function submitHandler(data: TRegisterSchema) {
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        "Accept-Language": locale,
        "Origin": host
      },
      body: JSON.stringify(data)
    })
    const response = await request.json()
    if (response.status === 'success') {
      router.push(`/auth/verify-account/${encodeURIComponent(data.email)}`)
    } else {
      toast.error(response.message)
    }
  }
  return (
    <form
    onSubmit={handleSubmit(submitHandler)}
      className='flex flex-col items-center justify-between gap-20 w-full h-full pb-4 '
    >
      <div  className={'flex flex-col gap-16 w-full'}>
        <div className='flex-1 flex lg:justify-center flex-col w-full pt-[4.5rem]'>
          <div className='flex flex-col gap-16 items-center'>
            <div className='flex flex-col gap-8 items-center'>
              <h3 className='font-medium font-primary text-[3.2rem] leading-[3.5rem] text-black'>{t('organizer')}
              </h3>
              <p className='text-[1.8rem] text-center leading-[2.5rem] text-neutral-700'>{t('description')}</p>
            </div>
            <div className=' w-full flex flex-col gap-6'>
              {/* <div className={'flex flex-col gap-[1.5rem]'}> */}
              <div>
                <div className={'flex gap-[1.5rem]'}>
                  <Input {...register('firstName')} type='text' error={errors.firstName?.message}>{t('placeholders.firstname')}</Input>
                  <Input {...register('lastName')} type='text' error={errors.lastName?.message}>{t('placeholders.lastname')}</Input>
                </div>
              </div>
              <Input {...register('email')} type='email' error={errors.email?.message}>{t('placeholders.email')}</Input>
              {/* </div> */}
              <PasswordInput error={errors.password?.message} {...register("password")}>{t('placeholders.password')}</PasswordInput>
              <PasswordInput error={errors.password_confirmation?.message} {...register("password_confirmation")}>{t('placeholders.confirm')}</PasswordInput>
            </div>
            <div className='w-full hidden lg:block'>
              <ButtonPrimary
                disabled={isSubmitting}
                type={'submit'}
                className={'w-full disabled:opacity-50 disabled:cursor-not-allowed '}
              >
                {isSubmitting ? <LoadingCircleSmall /> : t('cta.submit')}
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-6 w-full'>
        <ButtonPrimary type='submit' disabled={isSubmitting} className='w-full lg:hidden disabled:opacity-50 disabled:cursor-not-allowed'>
          {isSubmitting ? <LoadingCircleSmall /> : t('cta.submit')}
        </ButtonPrimary>
        <div
          className={
            'flex items-center justify-between gap-[1.8rem] border border-neutral-100  p-4 rounded-[10rem] mb-8'
          }
        >
          <span
            className={'font-normal text-[1.8rem] leading-[25px] text-center text-neutral-700'}
          >
            {t('choice.footer.text')}
          </span>
          <Link
            href={`/auth/login`}
            className={
              'border-2 border-primary-500 px-[3rem] py-6 rounded-[10rem] font-normal text-primary-500 text-[1.5rem] leading-[20px] bg-primary-100'
            }
          >
            {t('choice.footer.cta')}
          </Link>
        </div>
      </div>
    </form>
  )
}
