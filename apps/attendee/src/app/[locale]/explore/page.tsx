import AttendeeLayout from '@/components/Layouts/AttendeeLayout'
import React from 'react'
import ExplorePageContent from './ExplorePageContent'
import Event from '@/types/Event'

export default async function Explore() {
  const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`)
  const response = await request.json()
  const events:Event[] = response.events
  return (
    <AttendeeLayout title='Explore'>
      <ExplorePageContent events={events}/>
    </AttendeeLayout>
  )
}
