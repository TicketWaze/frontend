'use client'
import EventCard from '@/components/EventCard'
import Slugify from '@/lib/Slugify'
import Event from '@/types/Event'
import { SearchNormal, Ticket } from 'iconsax-react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

export default function ExplorePageContent({ events }: { events: Event[] }) {
  const t = useTranslations("Explore")
  const [query, setQuery] = useState('')
  const filteredEvents = events.filter((event) => {
    const search = query.toLowerCase()
    return event.eventName.toLowerCase().includes(search)
  })

  const [mobileSearch, setMobileSearch] = useState(false)
  return (
    <>
      <header className='w-full flex items-center justify-between'>
        <div className='flex flex-col gap-[5px]'>
          {/* <span className='text-[1.6rem] leading-8 text-neutral-600'>{t('subtitle')} <span className='text-deep-100'>{user.firstName}</span></span> */}
          <span className='font-primary font-medium text-[1.8rem] lg:text-[2.6rem] leading-[2.5rem] lg:leading-12 text-black'>{t('title')}</span>
        </div>
        <div className={'flex items-center gap-4 '}>
          {mobileSearch && (
            <div
              className={
                'bg-neutral-100 w-full rounded-[30px] flex items-center justify-between lg:hidden px-[1.5rem] py-4'
              }
            >
              <input
                placeholder={t('search')}
                className={
                  'text-black font-normal text-[1.4rem] leading-[20px] w-full outline-none'
                }
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={() => setMobileSearch(!mobileSearch)}>
                <SearchNormal size="20" color="#737c8a" variant="Bulk" />
              </button>
            </div>
          )}
          <div
            className={
              'hidden bg-neutral-100 rounded-[30px] lg:flex items-center justify-between w-[243px] px-[1.5rem] py-4'
            }
          >
            <input
              placeholder={t('search')}
              className={'text-black font-normal text-[1.4rem] leading-[20px] w-full outline-none'}
              onChange={(e) => setQuery(e.target.value)}
            />
            <SearchNormal size="20" color="#737c8a" variant="Bulk" />
          </div>
          {!mobileSearch && (
            <button
              onClick={() => setMobileSearch(!mobileSearch)}
              className={
                'w-[35px] h-[35px] bg-neutral-100 rounded-full flex lg:hidden items-center justify-center'
              }
            >
              <SearchNormal size="20" color="#737c8a" variant="Bulk" />
            </button>
          )}
        </div>
      </header>
      <ul className='list pt-4'>
        {filteredEvents.map(event => {
          const date = new Date(event.eventDays[0]?.startDate ?? '').toUTCString()
          const UtcDAte = new Date(date)


          const slug = Slugify(event.eventName)
          return <li key={event.eventId}>
            <EventCard
              href={`/explore/${slug}`}
              image={event.eventImageUrl}
              name={event.eventName}
              date={UtcDAte}
              country={event.country ?? ''}
              city={event.city ?? ''}
              price={event.eventTicketTypes[0]?.ticketTypePrice ?? 0}
              currency={event.currency}
              tags={event.eventTags}
            />
          </li>
        })}
      </ul>
      {filteredEvents.length === 0 && <div className='flex flex-col items-center gap-[30px]'>
        <div className='h-[120px] w-[120px] bg-neutral-100 rounded-full flex items-center justify-center'>
          <div className='w-[90px] h-[90px] bg-neutral-200 flex items-center justify-center rounded-full'>
            <Ticket size="50" color="#0D0D0D" variant="Bulk" />
          </div>
        </div>
        <span className='font-primary text-[1.8rem] leading-8 text-neutral-600'>{t('noResult')} <span className='text-deep-100'>{query}</span></span>
      </div>}
    </>
  )
}
