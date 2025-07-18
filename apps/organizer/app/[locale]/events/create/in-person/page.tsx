import OrganizerLayout from '@/components/Layouts/OrganizerLayout'
import React from 'react'
import CreateInPersonEventForm from './CreateInPersonEventForm'
import { api } from '@/lib/Api'

export default async function InPersonPage() {
  const tagRequest = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`)
  const tagResponse = await tagRequest.json()
  return (
    <OrganizerLayout title=''>
      <CreateInPersonEventForm tags={tagResponse.tags}/>
    </OrganizerLayout>
  )
}
