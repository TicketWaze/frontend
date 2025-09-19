'use client'
import PageLoader from '@/components/Loaders/PageLoader'
import User from '@/types/User'
import { Layer, Star, User as UserIcon } from 'iconsax-react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import Unfollow from '../../explore/[slug]/Unfollow'
import Follow from '../../explore/[slug]/Follow'
import Event from '@/types/Event'

export default function OrganizerActions({ user, organisation, events }: { user: User; organisation: any; events: Event[] }) {
    const t = useTranslations("Organizers")
    const [isLoading, setIsLoading] = useState(false)
    const isFollowing = organisation.followers.filter((follower: any) => follower.userId === user.userId)
    return (
        <div className='flex flex-col gap-8'>
            <div className='flex items-center justify-between'>
                <PageLoader isLoading={isLoading} />
                <div className='flex  gap-8'>
                    <div className='flex items-center gap-4 text-[1.4rem] leading-8 text-deep-100'>
                        <div className='h-[35px] w-[35px] bg-neutral-100 flex items-center justify-center rounded-full'><Star variant='Bulk' size={20} color='#E45B00' /></div>
                        {organisation.averageRating} {t('profile.rating')}
                    </div>
                    <div className='hidden lg:flex items-center gap-4 text-[1.4rem] leading-8 text-deep-100'>
                        <div className='h-[35px] w-[35px] bg-neutral-100 flex items-center justify-center rounded-full'><UserIcon variant='Bulk' size={20} color='#2E3237' /></div>
                        {organisation.followers.length} {t('profile.followers')}
                    </div>
                    <div className='hidden lg:flex items-center gap-4 text-[1.4rem] leading-8 text-deep-100'>
                        <div className='h-[35px] w-[35px] bg-neutral-100 flex items-center justify-center rounded-full'><Layer variant='Bulk' size={20} color='#2E3237' /></div>
                        {events.length} {t('event')}
                    </div>
                </div>
                {isFollowing.length > 0 ? <Unfollow user={user} organisationId={organisation.organisationId} /> : <Follow user={user} organisationId={organisation.organisationId} />}
            </div>
            <div className='flex lg:hidden gap-8 items-center'>
                <div className='flex items-center gap-4 text-[1.4rem] leading-8 text-deep-100'>
                    <div className='h-[35px] w-[35px] bg-neutral-100 flex items-center justify-center rounded-full'><UserIcon variant='Bulk' size={20} color='#2E3237' /></div>
                    {organisation.followers.length} {t('profile.followers')}
                </div>
                <div className='flex items-center gap-4 text-[1.4rem] leading-8 text-deep-100'>
                    <div className='h-[35px] w-[35px] bg-neutral-100 flex items-center justify-center rounded-full'><Layer variant='Bulk' size={20} color='#2E3237' /></div>
                    {events.length} {t('event')}
                </div>
            </div>
        </div>
    )
}
