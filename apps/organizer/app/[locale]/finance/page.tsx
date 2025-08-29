import OrganizerLayout from '@/components/Layouts/OrganizerLayout'
import { LinkPrimary } from '@/components/Links'
import TopBar from '@workspace/ui/components/TopBar'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import FinancePageContent from './FinancePageContent'
import { auth } from '@/lib/auth'
import { api } from '@/lib/Api'

export default async function FinancePage() {
    const t = await getTranslations('Finance')
    const session = await auth()
    const transactions = await api(`/organisations/${session?.activeOrganisation.organisationId}/transactions`, session?.user.accessToken ?? '')
    
  return (
    <OrganizerLayout title='Finance'>
        <TopBar title={t('title')}>
            {/* <LinkPrimary className={'hidden lg:block'} href={'/finance/initiate-withdrawal'}>
            {t('withdraw_btn')}
          </LinkPrimary> */}
        </TopBar>
        <FinancePageContent transactions={transactions}/>
    </OrganizerLayout>
  )
}
