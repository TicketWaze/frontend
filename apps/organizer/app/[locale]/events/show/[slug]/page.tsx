import OrganizerLayout from '@/components/Layouts/OrganizerLayout'
import { auth } from '@/lib/auth'
import Event from '@/types/Event'
import BackButton from '@workspace/ui/components/BackButton'
import TopBar from '@workspace/ui/components/TopBar'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import EventPageDetails from './EventPageDetails'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
    const {slug} = await params
    const t = await getTranslations('Events.single_event')
    const session = await auth()
    const eventRequest =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${slug}`)
    const eventResponse = await eventRequest.json()
    const event:Event = eventResponse.event
    
  return (
    <OrganizerLayout title=''>
        <BackButton text={t('back')}/>
        
        <EventPageDetails event={event} slug={slug}/>
    </OrganizerLayout>
  )
}
