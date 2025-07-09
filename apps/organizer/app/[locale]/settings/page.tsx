import OrganizerLayout from '@/components/Layouts/OrganizerLayout'
import { SimpleTopbar } from '@/components/Layouts/Topbars'
import { Link } from '@/i18n/navigation'
import { Add, ArrowRight2, ArrowSwapHorizontal, CardPos, I24Support, Icon, Notification, Profile2User, SecuritySafe, Setting5, User } from 'iconsax-react'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import Signout from './Signout'

export default async function Settings() {
    const t = await getTranslations('Settings')

    const links = [
        {
            label: t('account.title'),
            href: '/settings/account',
            Icon: Setting5,
        },
        {
            label: t('profile.title'),
            href: '/settings/profile',
            Icon: User,
        },
        {
            label: t('team.title'),
            href: '/settings/team',
            Icon: Profile2User,
        },
        {
            label: t('security.title'),
            href: '/settings/security',
            Icon: SecuritySafe,
        },
        {
            label: t('payment.title'),
            href: '/settings/payment',
            Icon: CardPos,
        },
        {
            label: t('notification.title'),
            href: '/settings/notification',
            Icon: Notification,
        },
    ]
    return (
        <OrganizerLayout title={t('title')}>
            <SimpleTopbar title={t('title')} />
            <ul className='list-3 w-full'>
                {links.map(({ Icon, label, href }) => {
                    return (
                        <li key={label} className={'cursor-pointer'}>
                            <SettingsCardLink Icon={Icon} href={href} label={label} />
                        </li>
                    )
                })}
                <li className='lg:hidden'>
                    <SettingsCardLink Icon={I24Support} href={''} label={t('help')} />
                </li>
                <li className='lg:hidden'>
                    <SettingsCardLink Icon={ArrowSwapHorizontal} href={''} label={t('switch')} />
                </li>
                <li className='lg:hidden'>
                    <SettingsCardLink Icon={Add} href={''} label={t('new')} />
                </li>
                <Signout />
            </ul>
        </OrganizerLayout>
    )
}


function SettingsCardLink({ href, Icon, label }: { href: string; Icon: Icon, label: string }) {
    return (
        <Link
            href={href}
            className={
                'py-[35px] px-[15px] rounded-[10px] bg-neutral-100 hover:bg-primary-50 flex justify-between transition-all duration-500 cursor-pointer group'
            }
        >
            <div className={'flex items-center gap-[15px]'}>
                <Icon size="25" className=' transition-all duration-500 stroke-neutral-900 fill-neutral-900 group-hover:stroke-primary-500 group-hover:fill-primary-500' variant="Bulk" />
                <span
                    className={
                        'font-primary font-medium text-[2.2rem] transition-all duration-500 leading-[30px] text-neutral-900 group-hover:text-primary-500'
                    }
                >
                    {label}
                </span>
            </div>
            <div
                className={
                    'w-[35px] h-[35px] rounded-full flex items-center justify-center transition-all duration-500 bg-neutral-200 group-hover:bg-primary-100'
                }
            >
                <ArrowRight2 size="20" className=' transition-all duration-500 stroke-neutral-900 fill-neutral-900 group-hover:stroke-primary-500 group-hover:fill-primary-500' variant="Bulk" />
            </div>
        </Link>
    )
}