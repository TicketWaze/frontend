import OrganizerLayout from '@/components/Layouts/OrganizerLayout'
import BackButton from '@workspace/ui/components/BackButton'
import TopBar from '@workspace/ui/components/TopBar'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import AddMember from './AddMember'
import { getCookie } from 'cookies-next/server'
import { cookies } from 'next/headers'
import { auth } from '@/lib/auth'
import { api } from '@/lib/Api'
import MemberList from './MemberList'
import OrganisationMember from '@/types/OrganisationMember'

type ApiResponse = {
    status : string
    members : OrganisationMember[]
}

export default async function Page() {
    const t = await getTranslations('Settings.team')
    const organisationId = await getCookie('organisation-id', { cookies })
    const session = await auth()
    const members : ApiResponse = await api(`/organisations/${organisationId}/members`, session?.user.accessToken ?? '')
    const waitlistMembers  = await api(`/organisations/${organisationId}/waitlist`, session?.user.accessToken ?? '')
    return (
        <OrganizerLayout title={t('title')}>
            <div className='flex flex-col gap-8'>
                <BackButton text={t('back')} />
                <TopBar title={t('title')}>
                    <AddMember />
                </TopBar>
            </div>
            <MemberList members={members.members} waitlistMembers={waitlistMembers.members}  />
        </OrganizerLayout>
    )
}
