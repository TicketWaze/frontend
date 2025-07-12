import OrganizerLayout from '@/components/Layouts/OrganizerLayout'
import BackButton from '@workspace/ui/components/BackButton'
import TopBar from '@workspace/ui/components/TopBar'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import ProfileImage from './ProfileImage'
import ProfileForm from './ProfileForm'
import { ButtonPrimary } from '@workspace/ui/components/buttons'

export default async function Page() {
    const t = await getTranslations('Settings.profile')
    return (
        <OrganizerLayout title={t('title')}>
            <div className='flex flex-col gap-8'>
                <BackButton text={t('back')} />
                <TopBar title={t('title')}>
                    <ButtonPrimary form='profile-form'>{t('save')}</ButtonPrimary>
                </TopBar>
            </div>
            <div
                className={
                    'flex flex-col gap-[40px] w-full lg:w-[530px] mx-auto overflow-y-scroll overflow-x-hidden h-full'
                }
            >
                <ProfileImage/>
                <ProfileForm/>
            </div>
        </OrganizerLayout>
    )
}
