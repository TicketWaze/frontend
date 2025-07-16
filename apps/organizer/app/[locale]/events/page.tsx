import OrganizerLayout from '@/components/Layouts/OrganizerLayout'
import { LinkPrimary } from '@/components/Links'
import EventPageLoader from '@/components/Loaders/EventPageLoader'
import TopBar from '@workspace/ui/components/TopBar'
import { getTranslations } from 'next-intl/server'
import React, { Suspense } from 'react'
import EventPageContent from './EventPageContent'

export default async function EventPage() {
    const t = await getTranslations('Events')
    return (
        <OrganizerLayout title={t('title')}>
            <TopBar title={t('title')}>
                <LinkPrimary href='/events/create'>{t('create')}</LinkPrimary>
            </TopBar>

            <Suspense fallback={<EventPageLoader />}>
                <EventPageContent />
            </Suspense>
        </OrganizerLayout>
    )
}

