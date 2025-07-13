import OrganizerLayout from '@/components/Layouts/OrganizerLayout'
import BackButton from '@workspace/ui/components/BackButton'
import TopBar from '@workspace/ui/components/TopBar'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import NotificationForm from './NotificationForm'
import { getCookie } from 'cookies-next/server'
import { cookies } from 'next/headers'
import { api } from '@/lib/Api'
import { auth } from '@/lib/auth'

export default async function page() {
    const t = await getTranslations('Settings.notification')
    const organisationId = await getCookie('organisation-id', { cookies })
    const session = await auth()
    const notificationPreferences = await api(`/organisations/${organisationId}/notifications-preferences`, session?.user.accessToken ?? '')

    return (
        <OrganizerLayout title={t('title')}>
            <div className='flex flex-col gap-8'>
                <BackButton text={t('back')} />
                <TopBar title={t('title')} />
            </div>
            <NotificationForm notificationPreferences={notificationPreferences.preferences} />
        </OrganizerLayout>
    )
}
