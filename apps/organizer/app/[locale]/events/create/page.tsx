import OrganizerLayout from '@/components/Layouts/OrganizerLayout'
import BackButton from '@workspace/ui/components/BackButton'
import TopBar from '@workspace/ui/components/TopBar'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import EventTypeList from './EventTypeList'
import { SearchNormal } from 'iconsax-react'

export default async function CreatePage() {
    const t = await getTranslations('Events.create_event')
    return (
        <OrganizerLayout title={t('title')}>
            <EventTypeList />
        </OrganizerLayout>
    )
}
