'use client'
import EventCard from '@/components/EventCard'
import Slugify from '@/lib/Slugify'
import Event from '@/types/Event'
import User from '@/types/User'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function ExplorePageContent({ events, user }: { events: Event[]; user: User }) {
  const t = useTranslations("Explore")
  return (
    <>
      <header className='w-full flex items-center justify-between'>
        <div className='flex flex-col gap-[5px]'>
          <span className='text-[1.6rem] leading-8 text-neutral-600'>{t('subtitle')} <span className='text-deep-100'>{user.firstName}</span></span>
          <span className='font-primary font-medium text-[1.8rem] lg:text-[2.6rem] leading-[2.5rem] lg:leading-12 text-black'>{t('title')}</span>
        </div>
        {'test'}
      </header>
      <ul className='list pt-4'>
        {events.map(event => {
          const date = new Date(event.eventDays[0]?.startDate ?? '')
          const slug = Slugify(event.eventName)
          return <li key={event.eventId}>
            <EventCard
              href={`/explore/${slug}`}
              image={event.eventImageUrl}
              name={event.eventName}
              date={date}
              country={event.country ?? ''}
              city={event.city ?? ''}
              price={event.eventTicketTypes[0]?.ticketTypePrice ?? 0}
              currency={event.currency}
              tags={event.eventTags}
            />
          </li>
        })}
      </ul>
    </>
  )
}
