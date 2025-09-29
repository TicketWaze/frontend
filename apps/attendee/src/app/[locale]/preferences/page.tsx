import AttendeeLayout from '@/components/Layouts/AttendeeLayout'
import { SimpleTopbar } from '@/components/Layouts/Topbars'
import { getLocale, getTranslations } from 'next-intl/server'
import React from 'react'
import EmailNotifications from './EmailNotifications'
import { auth } from '@/lib/auth'
import UserPreference from '@/types/UserPreference'
import { redirect } from '@/i18n/navigation'

export default async function PreferencesPage() {
    const t = await getTranslations('Preferences')
    const session = await auth()
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/preferences`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${session?.user.accessToken}`,
        },
    })
    const response = await request.json()

    const userPreferences: UserPreference = await response.preferences

    const locale = await getLocale()
    if (!session) {
        redirect({ href: '/auth/login', locale })
    }
    return (
        <AttendeeLayout title={t('title')}>
            <SimpleTopbar title={t('title')} />
            <div
                className={
                    'flex flex-col justify-between gap-[40px] w-full lg:w-[530px] mx-auto overflow-y-scroll overflow-x-hidden h-full'
                }
            >
                <EmailNotifications userPreferences={userPreferences} />
            </div>
        </AttendeeLayout>
    )
}
