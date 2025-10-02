'use client'
import { UpdateUserProfile } from '@/actions/userActions'
import PageLoader from '@/components/Loaders/PageLoader'
import FormatDate from '@/lib/FormatDate'
import User from '@/types/User'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@workspace/ui/components/Inputs'
import Capitalize from '@workspace/ui/lib/Capitalize'
import { useTranslations } from 'next-intl'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from "zod/v4";

export default function UserProfileForm({ user, accessToken }: { user: User; accessToken: string }) {
    const t = useTranslations('Settings.account')

    const UpdateProfileSchema = z.object({
        firstName: z.string().min(1, t("errors.firstName")),
        lastName: z.string().min(1, t("errors.lastName")),
        phoneNumber: z.string().min(8, t("errors.phoneNumber"))
    });

    type TUpdateProfileSchema = z.infer<typeof UpdateProfileSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TUpdateProfileSchema>({
        resolver: zodResolver(UpdateProfileSchema),
    });

    async function submitHandler(data: TUpdateProfileSchema) {

        const result = await UpdateUserProfile(data.firstName, data.lastName, String(data.phoneNumber), accessToken)
        if (result?.error) {
            toast.error(result.error)
        }
    }
    return (
        <form id='user-form' onSubmit={handleSubmit(submitHandler)} className={'flex flex-col gap-8'}>
            {isSubmitting &&  <PageLoader isLoading={isSubmitting}/>}
            <span className={'pb-4 font-medium text-[1.8rem] leading-[25px] text-deep-100'}>
                {t('personal')}
            </span>
            {/* <div> */}
            <div className={'flex flex-col w-full lg:flex-row lg:justify-between gap-[1.5rem]'}>
                <Input type='text' {...register('firstName')} isLoading={isSubmitting} name='firstName' error={errors.firstName?.message} defaultValue={user.firstName} className='flex-1 w-full'>{t('placeholders.firstname')}</Input>
                <Input type='text' {...register('lastName')} isLoading={isSubmitting} name='lastName' error={errors.lastName?.message} defaultValue={user.lastName} className='flex-1 w-full'>{t('placeholders.lastname')}</Input>
            </div>

            {/* </div> */}
            <Input defaultValue={user.email} readOnly disabled className='cursor-not-allowed' type='email'>{t('placeholders.email')}</Input>
            <Input defaultValue={user.phoneNumber} {...register('phoneNumber')} isLoading={isSubmitting} name='phoneNumber' error={errors.phoneNumber?.message} type='string'>{t('placeholders.phone')}</Input>
            <Input defaultValue={FormatDate(user.dateOfBirth)} readOnly disabled className='cursor-not-allowed' type='text'>{t('placeholders.dob')}</Input>
            <Input disabled readOnly className='cursor-not-allowed' defaultValue={Capitalize(user.gender)} type='text'>{t('placeholders.gender')}</Input>
        </form>
    )
}
