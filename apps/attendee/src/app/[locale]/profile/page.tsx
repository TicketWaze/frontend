import AttendeeLayout from '@/components/Layouts/AttendeeLayout'
import {  TopBar } from '@/components/Layouts/Topbars'
import { ButtonPrimary } from '@workspace/ui/components/buttons'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import ProfilePageContent from './ProfilePageContent'
import { auth } from '@/lib/auth'
import User from '@/types/User'

export default async function ProfilePage() {
    const t = await getTranslations('Profile')
    const session = await auth()
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method : "GET",
        headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${session?.user.accessToken}`,
            },
    })
    const response = await request.json()
    
    return (
        <AttendeeLayout title={t('title')}>
            <ProfilePageContent user={response.user as User} analytics={response.userAnalytic} accessToken={session?.user.accessToken as string}/>
        </AttendeeLayout>
    )
}
