import OrganizerLayout from '@/components/Layouts/OrganizerLayout'
import { getTranslations } from 'next-intl/server'
import React, { Suspense } from 'react'
import UserInformations from './UserInformations'
import AccountPageLoader from '@/components/Loaders/AccountPageLoader'

export default async function Page() {

    const t = await getTranslations('Settings.account')
    return (
        <OrganizerLayout title={t('title')}>
            <Suspense fallback={<AccountPageLoader />}>
                <UserInformations />
            </Suspense>
        </OrganizerLayout>
    )
}
