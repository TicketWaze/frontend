import OrganizerLayout from '@/components/Layouts/OrganizerLayout'
import { LinkPrimary } from '@/components/Links'
import TopBar from '@workspace/ui/components/TopBar'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import FinancePageContent from './FinancePageContent'
import { auth } from '@/lib/auth'
import { api } from '@/lib/Api'
import { organisationPolicy } from '@/lib/role/organisationPolicy'
import UnauthorizedView from '@/components/Layouts/UnauthorizedView'

export default async function FinancePage() {
  const t = await getTranslations('Finance')
  const session = await auth()
  const transactions = await api(`/organisations/${session?.activeOrganisation.organisationId}/transactions`, session?.user.accessToken ?? '')
  const authorized = await organisationPolicy.viewFinance(
    session?.user.userId ?? '',
    session?.activeOrganisation.organisationId ?? ''
  )
  return (
    <OrganizerLayout title='Finance'>
      <TopBar title={t('title')}>
        {/* <LinkPrimary className={'hidden lg:block'} href={'/finance/initiate-withdrawal'}>
            {t('withdraw_btn')}
          </LinkPrimary> */}
      </TopBar>
      {authorized ? <FinancePageContent transactions={transactions} /> : <UnauthorizedView />}
    </OrganizerLayout>
  )
}
