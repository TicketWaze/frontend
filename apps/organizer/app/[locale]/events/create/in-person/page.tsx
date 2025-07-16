import OrganizerLayout from '@/components/Layouts/OrganizerLayout'
import React from 'react'
import CreateInPersonEventForm from './CreateInPersonEventForm'

export default function InPersonPage() {
  return (
    <OrganizerLayout title=''>
        <CreateInPersonEventForm />
    </OrganizerLayout>
  )
}
