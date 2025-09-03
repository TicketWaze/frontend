'use client'
import { TopBar } from '@/components/Layouts/Topbars'
import { ButtonPrimary, ButtonRed } from '@workspace/ui/components/buttons'
import { useTranslations } from 'next-intl'
import React from 'react'
import ProfileImage from './ProfileImage'
import User from '@/types/User'
import { Input } from '@workspace/ui/components/Inputs'
import UserAnalytic from '@/types/UserAnalytic'
import Separator from '@/components/Separator'
import FormatDate from '@/lib/FormatDate'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import PageLoader from '@/components/Loaders/PageLoader'
import { UpdateUserProfile } from '@/actions/userActions'
import { toast } from 'sonner'

export default function ProfilePageContent({ user, analytics, accessToken }: { user: User, analytics: UserAnalytic, accessToken: string }) {
  const t = useTranslations('Profile')

  const EditProfileSchema = z.object({
    firstName: z.string().min(2, { error: t('errors.firstname_length') }),
    lastName: z.string().min(2, { error: t('errors.lastname_length') }),
    // country: z.string({ error: t('errors.country') }),
    // city: z.string().min(1, { error: t('errors.city') }),
    // state: z.string().min(1, { error: t('errors.state') }),
    // dateOfBirth: z.string().min(1, { error: t('errors.dob') }),
    // phoneNumber: z.string().min(8, { error: t('errors.phone') }),
    // currencyId: z.string({ error: t('placeholders.errors.currency') })
  })
  type TEditProfileSchema = z.infer<typeof EditProfileSchema>

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TEditProfileSchema>({
    resolver: zodResolver(EditProfileSchema),
    values: {
      firstName: user.firstName,
      lastName: user.lastName,
      // city : user.city,
      // country : user.country,
      // state : user.state,
      // dateOfBirth : FormatDate(user.dateOfBirth),
      // phoneNumber : user.phoneNumber
    }
  })

  async function submitHandler(data: TEditProfileSchema) {
    const results = await UpdateUserProfile(accessToken, { ...data, phoneNumber: user.phoneNumber })
    if (results.status === "failed") {
      toast.error(results.error)
    }
  }

  return (
    <>
      <PageLoader isLoading={isSubmitting} />
      <TopBar title={t('title')}>
        <ButtonPrimary form='edit-profile'>{t('save')}</ButtonPrimary>
      </TopBar>
      <div
        className={
          'flex flex-col gap-[40px] w-full lg:w-[530px] mx-auto overflow-y-scroll overflow-x-hidden h-full'
        }
      >
        <ProfileImage user={user} accessToken={accessToken} />
        <div className='flex flex-col gap-8'>
          <span className='font-medium text-[1.8rem] mb-4 leading-[25px] text-deep-100'>{t('personal')}</span>
          <form onSubmit={handleSubmit(submitHandler)} id='edit-profile' className='flex flex-col gap-8'>
            <div className='flex flex-col lg:flex-row items-center gap-8 w-full'>
              <Input className='w-full flex-1' {...register('firstName')} type='text' error={errors.firstName?.message}>{t('placeholders.firstname')}</Input>
              <Input className='w-full flex-1' {...register('lastName')} type='text' error={errors.lastName?.message}>{t('placeholders.lastname')}</Input>
            </div>
            <Input defaultValue={user.email} disabled readOnly>{t('placeholders.email')}</Input>
            <div className='flex flex-col lg:flex-row items-center gap-8 w-full'>
              <Input defaultValue={user.state} disabled readOnly className='w-full flex-1'>{t('placeholders.state')}</Input>
              <Input defaultValue={user.city} disabled readOnly className='w-full flex-1'>{t('placeholders.city')}</Input>
            </div>
            <Input defaultValue={user.country} disabled readOnly>{t('placeholders.country')}</Input>
            <Input defaultValue={FormatDate(user.dateOfBirth)} disabled readOnly>{t('placeholders.dob')}</Input>
            <Input defaultValue={user.phoneNumber} disabled readOnly>{t('placeholders.phone')}</Input>
          </form>
        </div>
        <div className='flex flex-col gap-8'>
          <span className='font-medium text-[1.8rem] mb-4 leading-[25px] text-deep-100'>{t('event.title')}</span>
          <div className='flex items-center justify-between'>
            <span className='font-normal text-[1.6rem] leading-[22.5px] text-neutral-600'>{t('event.attended')}</span>
            <span className='text-[1.6rem] font-medium leading-8 text-deep-100'>{analytics.eventAttended}</span>
          </div>
          <Separator />
          <div className='flex items-center justify-between'>
            <span className='font-normal text-[1.6rem] leading-[22.5px] text-neutral-600'>{t('event.tickets')}</span>
            <span className='text-[1.6rem] font-medium leading-8 text-deep-100'>{analytics.ticketPurchased}</span>
          </div>
          <Separator />
          <div className='flex items-center justify-between'>
            <span className='font-normal text-[1.6rem] leading-[22.5px] text-neutral-600'>{t('event.missed')}</span>
            <span className='text-[1.6rem] font-medium leading-8 text-deep-100'>{analytics.eventMissed}</span>
          </div>
        </div>
        <div className='flex flex-col gap-10'>
          <span className='font-medium text-[1.8rem] mb-4 leading-[25px] text-deep-100'>{t('account.title')}</span>
          <div className='flex items-center justify-between'>
            <span className='font-normal text-[1.6rem] leading-[22.5px] text-neutral-600'>{t('account.created')}</span>
            <span className='text-[1.6rem] font-medium leading-8 text-deep-100'>{FormatDate(user.createdAt)}</span>
          </div>
          <ButtonRed>{t('account.delete')}</ButtonRed>
        </div>
        <div></div>
      </div>
    </>
  )
}
