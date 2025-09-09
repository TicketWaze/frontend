'use client'
import { ButtonRed } from '@workspace/ui/components/buttons'
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function Signout() {
    const t = useTranslations('Settings')
    return (
        <li className='lg:hidden'>
            <ButtonRed className='w-full' onClick={() => signOut({redirect: true, redirectTo : process.env.NEXT_PUBLIC_APP_URL})}>{t('logout')}</ButtonRed>
        </li>
    )
}
