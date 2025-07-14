import BackButton from '@workspace/ui/components/BackButton'
import { ButtonPrimary, ButtonRed } from '@workspace/ui/components/buttons'
import TopBar from '@workspace/ui/components/TopBar'
import React from 'react'
import ProfileImage from './ProfileImage'
import User from '@/types/User'
import UserAnalytic from '@/types/UserAnalytic'
import { getTranslations } from 'next-intl/server'
import { auth } from '@/lib/auth'
import { api } from '@/lib/Api'
import UserProfileForm from './UserProfileForm'
import FormatDate from '@/lib/FormatDate'

export default async function UserInformations() {
    const t = await getTranslations('Settings.account')

    const session = await auth()
    const accessToken = session?.user.accessToken

    const data = await api('/users/me', accessToken ?? '')
    const user: User & UserAnalytic = await data.user

    return (
        <>
            <div className='flex flex-col gap-8'>
                <BackButton text={t('back')} />
                <TopBar title={t('title')}>
                    <ButtonPrimary form='user-form'>{t('save')}</ButtonPrimary>
                </TopBar>
            </div>

            <div
                className={
                    'flex flex-col justify-between gap-[40px] w-full lg:w-[530px] mx-auto overflow-y-scroll overflow-x-hidden h-full'
                }
            >
                <ProfileImage user={user} />

                <UserProfileForm user={user} accessToken={accessToken ?? ''} />

                {/* event */}
                <div className={'flex flex-col gap-8'}>
                    <span className={'pb-4 font-medium text-[1.8rem] leading-[25px] text-deep-100'}>
                        {t('event.title')}
                    </span>
                    <div className={'flex items-center justify-between'}>
                        <p className={'font-normal text-[1.6rem] leading-[22px] text-neutral-600'}>
                            {t('event.attended')}
                        </p>
                        <span className={'font-medium text-[1.6rem] leading-8 text-deep-100'}>
                            {user.eventAttended}
                        </span>
                    </div>
                    <div className={'h-[1px] w-full bg-neutral-100'}></div>
                    <div className={'flex items-center justify-between'}>
                        <p className={'font-normal text-[1.6rem] leading-[22px] text-neutral-600'}>
                            {t('event.tickets')}
                        </p>
                        <span className={'font-medium text-[1.6rem] leading-8 text-deep-100'}>
                            {user.ticketPurchased}
                        </span>
                    </div>
                    <div className={'h-[1px] w-full bg-neutral-100'}></div>
                    <div className={'flex items-center justify-between'}>
                        <p className={'font-normal text-[1.6rem] leading-[22px] text-neutral-600'}>
                            {t('event.missed')}
                        </p>
                        <span className={'font-medium text-[1.6rem] leading-8 text-deep-100'}>
                            {user.eventMissed}
                        </span>
                    </div>
                </div>
                {/* account */}
                <div className={'flex flex-col gap-12'}>
                    <span className={' font-medium text-[1.8rem] leading-[25px] text-deep-100'}>
                        {t('account.title')}
                    </span>
                    <div className={'flex items-center justify-between'}>
                        <p className={'font-normal text-[1.6rem] leading-[22px] text-neutral-600'}>
                            {t('account.created')}
                        </p>
                        <span className={'font-medium text-[1.6rem] leading-8 text-deep-100'}>
                            {FormatDate(user.createdAt)}
                        </span>
                    </div>
                    <ButtonRed>{t('account.delete')}</ButtonRed>
                </div>
                <div className='hidden lg:block'></div>
            </div>
        </>
    )
}
