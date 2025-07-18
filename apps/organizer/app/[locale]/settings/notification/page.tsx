import OrganizerLayout from '@/components/Layouts/OrganizerLayout'
import BackButton from '@workspace/ui/components/BackButton'
import TopBar from '@workspace/ui/components/TopBar'
import { getTranslations } from 'next-intl/server'
import React, { Suspense } from 'react'
import NotificationForm from './NotificationForm'
import { getCookie } from 'cookies-next/server'
import { cookies } from 'next/headers'
import { api } from '@/lib/Api'
import { auth } from '@/lib/auth'

export default async function Page() {
    const t = await getTranslations('Settings.notification')
    const session = await auth()
    const organisation = session?.activeOrganisation
    const notificationPreferences = await api(`/organisations/${organisation?.organisationId}/notifications-preferences`, session?.user.accessToken ?? '')

    return (
        <OrganizerLayout title={t('title')}>
            <div className='flex flex-col gap-8'>
                <BackButton text={t('back')} />
                <TopBar title={t('title')} />
            </div>
            <Suspense fallback={<p>loading</p>}>
                <NotificationForm notificationPreferences={notificationPreferences.preferences} />
            </Suspense>
        </OrganizerLayout>
    )
}
