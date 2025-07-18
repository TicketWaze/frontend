import OrganizerLayout from '@/components/Layouts/OrganizerLayout'
import { LinkPrimary } from '@/components/Links'
import EventPageLoader from '@/components/Loaders/EventPageLoader'
import TopBar from '@workspace/ui/components/TopBar'
import { getTranslations } from 'next-intl/server'
import React, { Suspense } from 'react'
import EventPageContent from './EventPageContent'
import { api } from '@/lib/Api'
import { auth } from '@/lib/auth'

export default async function EventPage() {
    const t = await getTranslations('Events')
    const session = await auth()
    const events = await api(`/organisations/${session?.activeOrganisation.organisationId}/events`, session?.user.accessToken ?? '')
    return (
        <OrganizerLayout title={t('title')}>
            <TopBar title={t('title')}>
                <LinkPrimary className='hidden lg:block' href='/events/create'>{t('create')}</LinkPrimary>
                <LinkPrimary className='lg:hidden absolute bottom-36 right-8 ' href='/events/create'>{t('create')}</LinkPrimary>
            </TopBar>

            <Suspense fallback={<EventPageLoader />}>
                <EventPageContent events={events.events} />
            </Suspense>
        </OrganizerLayout>
    )
}

