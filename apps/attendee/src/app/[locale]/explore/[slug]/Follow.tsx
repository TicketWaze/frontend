'use client'
import { FollowOrganisationAction } from '@/actions/userActions'
import PageLoader from '@/components/Loaders/PageLoader'
import { usePathname } from '@/i18n/navigation'
import User from '@/types/User'
import { ButtonBlack } from '@workspace/ui/components/buttons'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function Follow({ user, organisationId }: { user: User, organisationId: string }) {
    const t = useTranslations('Event')
    const [isLoading, setIsLoading] = useState(false)
    const pathname = usePathname()
    async function FollowOrganisation() {
        setIsLoading(true)
        const response = await FollowOrganisationAction(user.accessToken, organisationId, pathname)
        if (response.error) {
            toast.error(response.message)
        }
        setIsLoading(false)
    }
    return (
        <>
            {isLoading && <PageLoader isLoading={isLoading} />}
            <ButtonBlack onClick={FollowOrganisation} >{t("follow")}</ButtonBlack>
        </>
    )
}
