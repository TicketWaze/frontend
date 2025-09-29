import AttendeeLayout from '@/components/Layouts/AttendeeLayout'
import { redirect } from '@/i18n/navigation'
import { auth } from '@/lib/auth'
import { getLocale } from 'next-intl/server'
import React from 'react'

export default async function HistoryPage() {
   const locale = await getLocale()
    const session = await auth()
    if (!session) {
        redirect({ href: '/auth/login', locale })
    }
  return (
    <AttendeeLayout title='HistoryPage'>HistoryPage</AttendeeLayout>
  )
}
