import OrganizerLayout from '@/components/Layouts/OrganizerLayout'
import Event from '@/types/Event'
import BackButton from '@workspace/ui/components/BackButton'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import EventPageDetails from './EventPageDetails'
import Ticket from '@/types/Ticket'
import { auth } from '@/lib/auth'
import User from '@/types/User'

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
    const organisationCheckers = eventResponse.organisationCheckers
    const session = await auth()
    const eventCheckers = eventResponse.eventCheckers
    
    
  return (
    <OrganizerLayout title=''>
        <BackButton text={t('back')}/>
        <EventPageDetails eventCheckers={eventCheckers} user={session?.user as User} event={event} tickets={tickets} slug={slug} organisationCheckers={organisationCheckers}/>
    </OrganizerLayout>
  )
}
