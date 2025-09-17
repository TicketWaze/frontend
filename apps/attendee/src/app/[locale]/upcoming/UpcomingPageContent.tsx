'use client'
import UpcomingCard from '@/components/UpcomingCard'
import Slugify from '@/lib/Slugify'
import { Money3 } from 'iconsax-react'
import { DateTime } from 'luxon'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function UpcomingPageContent({ events }: { events: any }) {
    const t = useTranslations('Upcoming')
    return (
        <>
            <header className='w-full flex items-center justify-between'>
                <div className='flex flex-col gap-[5px]'>
                    <span className='font-primary font-medium text-[1.8rem] lg:text-[2.6rem] leading-[2.5rem] lg:leading-12 text-black'>{t('title')}</span>
                </div>
                {'test'}
            </header>
            <ul className='list pt-4'>
                {events.map((event: any) => {
                    const today = DateTime.now()
                    const eventStart = event.eventDays?.[0]?.startDate
                        ? DateTime.fromISO(event.eventDays[0].startDate)
                        : null
                    const daysLeft = eventStart ? eventStart.diff(today, 'days').days : null
                    const roundedDays = Math.ceil(daysLeft && daysLeft > 0 ? daysLeft : 0)
                    const date = new Date(event.eventDays[0]?.startDate ?? '')
                    const slug = Slugify(event.eventName)
                    return <li key={event.eventId}>
                        <UpcomingCard
                            href={`upcoming/${slug}`}
                            image={event.eventImageUrl}
                            name={event.eventName}
                            day={roundedDays}
                            tickets={event.tickets.length}
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
        </>
    )
}
