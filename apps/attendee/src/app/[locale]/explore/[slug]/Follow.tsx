'use client'
import { FollowOrganisationAction } from '@/actions/userActions'
import NoAuthDialog from '@/components/Layouts/NoAuthDialog'
import PageLoader from '@/components/Loaders/PageLoader'
import { usePathname } from '@/i18n/navigation'
import User from '@/types/User'
import { ButtonBlack } from '@workspace/ui/components/buttons'
import { Dialog, DialogTrigger } from '@workspace/ui/components/dialog'
import { useSession } from 'next-auth/react'
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
    const { data: session } = useSession()
    return (
        <>
            {isLoading && <PageLoader isLoading={isLoading} />}
            {session?.user ?
                <ButtonBlack onClick={FollowOrganisation} >{t("follow")}</ButtonBlack>
                :
                <Dialog>
                    <DialogTrigger asChild>
                        <ButtonBlack>{t("follow")}</ButtonBlack>
                    </DialogTrigger>
                    <NoAuthDialog />
                </Dialog>
            }

        </>
    )
}
