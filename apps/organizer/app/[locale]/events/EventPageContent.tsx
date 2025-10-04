'use client'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import Event from '@/types/Event'
import EventCard from '@/components/EventCard'
import { DateTime } from 'luxon'
import Slugify from '@/lib/Slugify'
import { Money3 } from 'iconsax-react'
import { useTranslations } from 'next-intl'

export default function EventPageContent({ events }: { events: Event[] }) {
    const t = useTranslations('Events')
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
                            const slug = Slugify(event.eventName)
                            return <li key={event.eventId}>
                                <EventCard
                                    href={`/events/show/${slug}`}
                                    image={event.eventImageUrl}
                                    name={event.eventName}
                                    date={date}
                                    country={event.country ?? ''}
                                    city={event.city ?? ''}
                                    price={event.eventTicketTypes[0]?.ticketTypePrice ?? 0}
                                    currency={event.currency}
                                    tags={event.eventTags}
                                    eventType={event.eventType}
                                />
                            </li>
                        })}
                    </ul>
                    {events.length === 0 && <div className={'w-[330px] lg:w-[460px] mx-auto flex flex-col items-center gap-[5rem]'}>
                        <div
                            className={
                                'w-[120px] h-[120px] rounded-full flex items-center justify-center bg-neutral-100'
                            }
                        >
                            <div
                                className={
                                    'w-[90px] h-[90px] rounded-full flex items-center justify-center bg-neutral-200'
                                }
                            >
                                <Money3 size="50" color="#0d0d0d" variant="Bulk" />
                            </div>
                        </div>
                        <div className={'flex flex-col gap-[3rem] items-center text-center'}>
                            <p
                                className={
                                    'text-[1.8rem] leading-[25px] text-neutral-600 max-w-[330px] lg:max-w-[422px]'
                                }
                            >
                                {t('description')}
                            </p>
                        </div>
                    </div>}
                </TabsContent>

                <UpcomingContent events={events} />
                <HistoryContent events={events} />

            </Tabs>
        </div>
    )
}

function UpcomingContent({ events }: { events: Event[] }) {
    const t = useTranslations('Events')
    const upcoming = events.filter(event => {
        const today = DateTime.now()
        const eventStart = event.eventDays?.[0]?.startDate
            ? DateTime.fromISO(event.eventDays[0].startDate)
            : null
        const daysLeft = eventStart ? eventStart.diff(today, 'days').days : null
        return daysLeft && daysLeft >= 0
    })
    return (
        <TabsContent value='upcoming'>
            <ul className='list pt-4'>
                {upcoming.map(event => {
                    const date = new Date(event.eventDays[0]?.startDate ?? '')
                    const slug = Slugify(event.eventName)
                    return <li key={event.eventId}>
                        <EventCard
                            href={`/events/show/${slug}`}
                            image={event.eventImageUrl}
                            name={event.eventName}
                            date={date}
                            country={event.country ?? ''}
                            city={event.city ?? ''}
                            price={event.eventTicketTypes[0]?.ticketTypePrice ?? 0}
                            currency={event.currency}
                            tags={event.eventTags}
                            eventType={event.eventType}
                        />
                    </li>
                })}
            </ul>
            {upcoming.length === 0 && <div className={'w-[330px] lg:w-[460px] mx-auto flex flex-col items-center gap-[5rem]'}>
                <div
                    className={
                        'w-[120px] h-[120px] rounded-full flex items-center justify-center bg-neutral-100'
                    }
                >
                    <div
                        className={
                            'w-[90px] h-[90px] rounded-full flex items-center justify-center bg-neutral-200'
                        }
                    >
                        <Money3 size="50" color="#0d0d0d" variant="Bulk" />
                    </div>
                </div>
                <div className={'flex flex-col gap-[3rem] items-center text-center'}>
                    <p
                        className={
                            'text-[1.8rem] leading-[25px] text-neutral-600 max-w-[330px] lg:max-w-[422px]'
                        }
                    >
                        {t('description')}
                    </p>
                </div>
            </div>}
        </TabsContent>
    )
}

function HistoryContent({ events }: { events: Event[] }) {
    const t = useTranslations('Events')
    const history = events.filter(event => {
        const today = DateTime.now()
        const eventStart = event.eventDays?.[0]?.startDate
            ? DateTime.fromISO(event.eventDays[0].startDate)
            : null
        const daysLeft = eventStart ? eventStart.diff(today, 'days').days : null
        return daysLeft && daysLeft < 0
    })
    return (
        <TabsContent value='history'>
            <ul className='list pt-4'>
                {history.map(event => {
                    const date = new Date(event.eventDays[0]?.startDate ?? '')
                    const slug = Slugify(event.eventName)
                    return <li key={event.eventId}>
                        <EventCard
                            href={`/events/show/${slug}`}
                            image={event.eventImageUrl}
                            name={event.eventName}
                            date={date}
                            country={event.country ?? ''}
                            city={event.city ?? ''}
                            price={event.eventTicketTypes[0]?.ticketTypePrice ?? 0}
                            currency={event.currency}
                            tags={event.eventTags}
                            eventType={event.eventType}
                        />
                    </li>
                })}
            </ul>
            {history.length === 0 && <div className={'w-[330px] lg:w-[460px] mx-auto flex flex-col items-center gap-[5rem]'}>
                <div
                    className={
                        'w-[120px] h-[120px] rounded-full flex items-center justify-center bg-neutral-100'
                    }
                >
                    <div
                        className={
                            'w-[90px] h-[90px] rounded-full flex items-center justify-center bg-neutral-200'
                        }
                    >
                        <Money3 size="50" color="#0d0d0d" variant="Bulk" />
                    </div>
                </div>
                <div className={'flex flex-col gap-[3rem] items-center text-center'}>
                    <p
                        className={
                            'text-[1.8rem] leading-[25px] text-neutral-600 max-w-[330px] lg:max-w-[422px]'
                        }
                    >
                        {t('description')}
                    </p>
                </div>
            </div>}
        </TabsContent>
    )

}
