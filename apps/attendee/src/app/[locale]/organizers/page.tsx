import AttendeeLayout from '@/components/Layouts/AttendeeLayout'
import React from 'react'
import OrganizersContents from './OrganizersContents'
import { auth } from '@/lib/auth'
import Organisation from '@/types/Organisation'

export default async function OrganizersPage() {
    const session = await auth()
    const organisationRequest = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organisations`)
    const organisationResponse = await organisationRequest.json()

    const userRequest = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/followed-organisations`,{
        method: "GET",
        headers: {
            "Authorization": `Bearer ${session?.user.accessToken}`,
            'Content-Type': 'application/json',
        },
    })
    const userResponse  = await userRequest.json()
    const followedOrganisations : Organisation[] = userResponse.followedOrganisations
    
  return (
    <AttendeeLayout title='OrganizersPage'>
        <OrganizersContents organisations={organisationResponse.organisations} followedOrganisations={followedOrganisations}/>
    </AttendeeLayout>
  )
}
