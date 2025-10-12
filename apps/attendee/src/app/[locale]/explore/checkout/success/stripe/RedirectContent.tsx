'use client'
import PageLoader from '@/components/Loaders/PageLoader'
import { useRouter } from '@/i18n/navigation'
import Slugify from '@/lib/Slugify'
import User from '@/types/User'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

export default function RedirectContent({ orderId, user }: { orderId: string, user: User }) {
    const t = useTranslations('Checkout')
    const router = useRouter()

    useEffect(function () {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/stripe/success/${orderId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${user.accessToken}`,
            },
        })
            .then(res => res.json())
            .then(res => {
                if (res.status === 'success') {
                    toast.success("Success")
                    router.push(`/upcoming/${Slugify(res.event.eventName)}`)
                } else {
                    toast.error("Failed to retrieve payment")
                    router.push(`/explore/${Slugify(res.event.eventName)}`)
                }
            })
    }, [])
    return (
        <>
            <PageLoader isLoading={true} />
        </>
    )
}
