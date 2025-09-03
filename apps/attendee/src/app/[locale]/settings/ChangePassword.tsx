'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ButtonPrimary } from '@workspace/ui/components/buttons'
import { Input, PasswordInput } from '@workspace/ui/components/Inputs'
import LoadingCircleSmall from '@workspace/ui/components/LoadingCircleSmall'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

export default function ChangePassword() {
    const t = useTranslations('Settings')
    const { data: session } = useSession()
    const changePasswordSchema = z.object({
        currentPassword: z.string().min(1, t('password.errors.blank')),
        password: z.string().min(8, t('password.errors.password')),
        password_confirmation: z.string().min(8, t('password.errors.password'))
    }).refine((data) => data.password === data.password_confirmation, {
        path: ['password_confirmation'],
        message: t('password.errors.confirm')
    })
    type TChangePasswordSchema = z.infer<typeof changePasswordSchema>

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TChangePasswordSchema>({
        resolver: zodResolver(changePasswordSchema)
    })
    async function submitHandler(data: TChangePasswordSchema) {
        const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/change-password`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${session?.user.accessToken}`,
            },
            body: JSON.stringify(data)
        })
        const response = await request.json()
        if(response.status === 'success'){
            toast.success("Password Updated")
        }else{
            toast.error(response.message)
        }
    }
    return (
        <form onSubmit={handleSubmit(submitHandler)} className='flex flex-col gap-12'>
            <span className='font-medium text-[1.8rem] leading-[25px] text-deep-100'>{t('password.title')}</span>
            <div className='flex flex-col gap-8'>
                <PasswordInput {...register('currentPassword')} error={errors.currentPassword?.message}>{t('placeholders.password')}</PasswordInput>
                <PasswordInput {...register('password')} error={errors.password?.message}>{t('placeholders.new')}</PasswordInput>
                <PasswordInput {...register('password_confirmation')} error={errors.password_confirmation?.message}>{t('placeholders.confirm')}</PasswordInput>
            </div>
            <ButtonPrimary type='submit' disabled={isSubmitting}>{isSubmitting ? <LoadingCircleSmall /> : t('password.cta')}</ButtonPrimary>
        </form>
    )
}
