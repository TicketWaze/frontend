import AttendeeLayout from '@/components/Layouts/AttendeeLayout'
import React from 'react'
import ExplorePageContent from './ExplorePageContent'
import Event from '@/types/Event'
import { auth } from '@/lib/auth'
import User from '@/types/User'

export default async function Explore() {
  const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`)
  const response = await request.json()
  const events:Event[] = response.events
  const session = await auth()
  return (
    <AttendeeLayout title='Explore'>
      <ExplorePageContent events={events} user={session?.user as User}/>
    </AttendeeLayout>
  )
}
