import OrganizerLayout from '@/components/Layouts/OrganizerLayout'
import Event from '@/types/Event'
import BackButton from '@workspace/ui/components/BackButton'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import EventPageDetails from './EventPageDetails'
import Ticket from '@/types/Ticket'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
    const {slug} = await params
    const t = await getTranslations('Events.single_event')
    const eventRequest =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${slug}`)
    const eventResponse = await eventRequest.json()
    const event:Event = eventResponse.event
    const tickets:Ticket[] = eventResponse.tickets   
  return (
    <OrganizerLayout title=''>
        <BackButton text={t('back')}/>
        <EventPageDetails event={event} tickets={tickets} slug={slug}/>
    </OrganizerLayout>
  )
}
