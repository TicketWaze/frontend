'use client'
import { LinkAccent } from '@/components/Links'
import { Link, useRouter } from '@/i18n/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { ButtonPrimary } from '@workspace/ui/components/buttons'
import { Input, PasswordInput } from '@workspace/ui/components/Inputs'
import LoadingCircleSmall from "@workspace/ui/components/LoadingCircleSmall"
import { getSession, signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from "zod/v4";

export default function LoginPage() {
  const t = useTranslations('Auth.login')
  const LoginSchema = z.object({
    email: z.email(t("errors.email")),
    password: z.string().min(1, t("errors.password"))
  });
  const searchParams = useSearchParams()
  const invite = searchParams.get('invite')

  type TLoginSchema = z.infer<typeof LoginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(LoginSchema),
  });
  const [isLoading, setIsloading] = useState(false)
  const router = useRouter()
  async function submitHandler(data: TLoginSchema) {
    setIsloading(true)
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
    });

    if (result?.error) {
      toast.error('Login failed')
    } else {
      if (invite) {
        const session = await getSession()
        router.push(`/auth/invite/${invite}?accessToken=${session?.user.accessToken}`)
      } else {
        router.push('/analytics')
      }
    }
    setIsloading(false)
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

            <PasswordInput error={errors.password?.message} {...register("password")}>{t('placeholders.password')}</PasswordInput>
            <div className='flex items-center justify-between'>
              <span></span>
              <Link className='text-[1.5rem] leading-8 text-primary-500' href={'/auth/forgot-password'}>{t('forgot')}</Link>
            </div>
          </div>
          <div className='w-full hidden lg:block'>
            <ButtonPrimary type='submit' disabled={isLoading} className='w-full'>
              {isLoading ? <LoadingCircleSmall /> : t('cta.submit')}
            </ButtonPrimary>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-6 w-full'>
        <ButtonPrimary type='submit' disabled={isLoading} className='w-full lg:hidden'>
          {isLoading ? <LoadingCircleSmall /> : t('cta.submit')}
        </ButtonPrimary>
        <div className='border border-neutral-100 w-full lg:w-auto p-4 pl-6 flex items-center justify-between gap-4 lg:gap-[1.8rem] rounded-[100px]'>
          <span className='text-[1.8rem] leading-[2.5rem] text-neutral-700'>{t('footer.text')}</span>
          <LinkAccent href='/auth/register'>{t('footer.cta')}</LinkAccent>
        </div>
      </div>
    </form>
  )
}
