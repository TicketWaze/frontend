'use client'

import { useEffect } from 'react'
import { getCookie } from 'cookies-next'
import organisationStore from '@/store/OrganisationStore'

export default function OrganisationProvider() {
    useEffect(() => {
        const orgId = getCookie('organisation-id')
        if (!orgId) return

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/organisations/${orgId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },

        }).then((res) => res.json())
            .then((org) => organisationStore.setState(() => {
                return {
                    state: {
                        organisation: org.organisation
                    }
                }
            }))
    }, [])

    return null // no UI
}
