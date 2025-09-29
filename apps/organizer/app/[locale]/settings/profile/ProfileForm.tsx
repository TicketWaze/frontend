'use client'
import { UpdateOrganisationProfile } from '@/actions/organisationActions'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@workspace/ui/components/Inputs'
import Capitalize from '@workspace/ui/lib/Capitalize'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

export default function ProfileForm() {
  // const organisation = useStore(organisationStore, organisationStore => organisationStore.state.organisation)
  const t = useTranslations('Settings.profile')
  const { data: session, update } = useSession()
  const organisation = session?.activeOrganisation
  // const organisation = session?.user.organisations[0]

  const UpdateProfileSchema = z.object({
    organisationName: z.string().min(1, t('errors.name.min')).max(30, t('errors.name.max')),
    organisationDescription: z.string().min(150, t('errors.description.min')).max(350, t('errors.description.max'))
  })

  type TUpdateProfileSchema = z.infer<typeof UpdateProfileSchema>

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TUpdateProfileSchema>({
    resolver: zodResolver(UpdateProfileSchema),
    values: {
      organisationName: organisation?.organisationName ?? '',
      organisationDescription: organisation?.organisationDescription ?? ''
    },
  })
  async function submitHandler(data: TUpdateProfileSchema) {
    const result = await UpdateOrganisationProfile(organisation?.organisationId ?? '', data.organisationName, data.organisationDescription, session?.user.accessToken ?? '')
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(Capitalize(result.status ?? ''))
      if (result.organisation) {
                    await update({
                        ...session,
                        activeOrganisation: {
                            ...result.organisation
                        }
                    })
                }
    }
  }
  return (
    <form onSubmit={handleSubmit(submitHandler)} id='profile-form' className={'flex flex-col gap-8'}>
      <span className={'pb-4 font-medium text-[1.8rem] leading-[25px] text-deep-100'}>
        {t('subtitle')}
      </span>
      <Input {...register('organisationName')} error={errors.organisationName?.message} type='text' isLoading={isSubmitting}>{t('placeholders.name')}</Input>
      <div>
        <textarea
          {...register('organisationDescription')}
          disabled={isSubmitting}
          className={
            `bg-neutral-100 w-full rounded-[2rem] resize-none h-[150px] p-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500 {isLoading ? 'animate-pulse' : null}`
          }
        />
        <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
          {errors.organisationDescription?.message}
        </span>
      </div>
      <Input disabled={true} readOnly defaultValue={Capitalize(organisation?.country ?? '')}>{t('placeholders.country')}</Input>

      <div className={'flex gap-[1.5rem]'}>
        <Input className='flex-1' disabled={true} readOnly defaultValue={organisation?.state}>{t('placeholders.state')}</Input>
        <Input className='flex-1' disabled={true} readOnly defaultValue={organisation?.city}>{t('placeholders.city')}</Input>
      </div>
      <Input className='flex-1' disabled={true} readOnly defaultValue={organisation?.city}>{t('placeholders.city')}</Input>
      {/* <div>
            <input
              className={
                'bg-neutral-100 w-full rounded-[5rem] p-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500'
              }
              type="text"
              value={data?.website ?? ''}
              onChange={(e) => setData('website', e.target.value)}
              placeholder={profile.website}
              disabled={!formEnabled}
            />
            {errors.website && <InputError message={errors.website} />}
          </div> */}
      {/* <div>
            <div
              className={
                'bg-neutral-100 w-full rounded-[5rem] p-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border disabled:text-neutral-600 disabled:cursor-not-allowed border-transparent focus:border-primary-500 flex items-center'
              }
            >
              <div className={'flex gap-4 items-center'}>
                <Instagram size="20" color="#737C8A" variant="Bulk" />
                <span className={`${!formEnabled && 'text-neutral-600'}`}>
                  https://instagram.com/
                </span>
              </div>
              <input
                type="text"
                placeholder={'jane-doe'}
                disabled={!formEnabled}
                value={data.instagramUrl}
                onChange={(e) => setData('instagramUrl', e.target.value)}
                className={'outline-none disabled:text-neutral-600 disabled:cursor-not-allowed'}
              />
            </div>
            {errors.website && <InputError message={errors.website} />}
          </div> */}
      <div></div>
    </form>
  )
}
