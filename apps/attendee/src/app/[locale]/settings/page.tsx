import AttendeeLayout from '@/components/Layouts/AttendeeLayout'
import { SimpleTopbar } from '@/components/Layouts/Topbars'
import { getLocale, getTranslations } from 'next-intl/server'
import React from 'react'
import ChangePassword from './ChangePassword'
import AppLanguage from './AppLanguage'
import SendIcon from './send-sqaure-2.svg'
import Image from 'next/image'
import Separator from '@/components/Separator'
import { Link, redirect } from '@/i18n/navigation'
import { auth } from '@/lib/auth'

export default async function Settings() {
    const t = await getTranslations('Settings')
    const locale = await getLocale()
    const session = await auth()
    if (!session) {
        redirect({ href: '/auth/login', locale })
    }
    return (
        <AttendeeLayout title={t('title')}>
            <SimpleTopbar title={t('title')} />
            <div
                className={
                    'flex flex-col justify-between gap-[40px] w-full lg:w-[530px] mx-auto overflow-y-scroll overflow-x-hidden h-full'
                }
            >
                {/* change password */}
                <ChangePassword />

                {/* "App language" */}
                <AppLanguage />

                {/* Others */}
                <div className='flex flex-col gap-6'>
                    <span className='font-medium text-[1.8rem] mb-4 leading-[25px] text-deep-100'>{t('others.title')}</span>
                    <Link href={`https://ticketwaze.com/${locale}/privacy-policy`} className="flex items-center justify-between gap-3">
                        <span className="text-[1.6rem] text-deep-100">{t('others.privacy')}</span>
                        <Image src={SendIcon} alt='Send Icon' />
                    </Link>
                    <Separator />
                    <Link href={`https://ticketwaze.com/${locale}/terms-of-use`} className="flex items-center justify-between gap-3">
                        <span className="text-[1.6rem] text-deep-100">{t('others.terms')}</span>
                        <Image src={SendIcon} alt='Send Icon' />
                    </Link>
                </div>
                <div></div>
            </div>
        </AttendeeLayout>
    )
}
