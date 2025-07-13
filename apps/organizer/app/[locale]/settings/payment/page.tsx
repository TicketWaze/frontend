import OrganizerLayout from '@/components/Layouts/OrganizerLayout'
import BackButton from '@workspace/ui/components/BackButton'
import { ButtonPrimary } from '@workspace/ui/components/buttons'
import TopBar from '@workspace/ui/components/TopBar'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import PaymentInformationsForm from './PaymentInformationsForm'

export default async function Page() {
    const t = await getTranslations('Settings.payment')
    return (
        <OrganizerLayout title={t('title')}>
            <div className='flex flex-col gap-8'>
                <BackButton text={t('back')} />
                <TopBar title={t('title')}>
                    <ButtonPrimary form='payment-form'>{t('save')}</ButtonPrimary>
                </TopBar>
            </div>
            <PaymentInformationsForm/>
        </OrganizerLayout>
    )
}
