'use client'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import Event from '@/types/Event'
import EventCard from '@/components/EventCard'
import { DateTime } from 'luxon'
import { useSession } from 'next-auth/react'
import Slugify from '@/lib/Slugify'

export default function EventPageContent({ events }: { events: Event[] }) {
    const {data:session} = useSession()
    return (
        <div className='min-h-[75vh]'>
            <Tabs defaultValue="all" className="w-full h-full">
                <TabsList className={'w-full lg:w-fit mx-auto lg:mx-0'}>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value='all'>
                    <ul className='list pt-4'>
                        {events.map(event => {
                            const date = new Date(event.eventDays[0]?.startDate ?? '')
                            const slug  = Slugify(event.eventName)
                            return <li key={event.eventId}>
                                <EventCard
                                    href={`/events/show/${slug}`}
                                    image={event.eventImageUrl}
                                    name={event.eventName}
                                    date={date}
                                    country={event.country ?? ''}
                                    city={event.city ?? ''}
                                    price={event.eventTicketTypes[0]?.ticketTypePrice ?? 0}
                                    currency={session?.user.currency.isoCode ?? ''}
                                    tags={event.eventTags}
                                />
                            </li>
                        })}
                    </ul>
                </TabsContent>
                <UpcomingContent />
                <HistoryContent />

            </Tabs>
        </div>
    )
}

function UpcomingContent() {
    return <TabsContent value='upcoming'>Upcoming</TabsContent>
}

function HistoryContent() {
    return (
        <TabsContent value='history'>History</TabsContent>
    )
}
