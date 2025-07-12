'use server'

import { patch } from "@/lib/Api"
import { revalidatePath } from "next/cache"

export async function UpdateOrganisationProfile(organisationId: string, organisationName: string, organisationDescription: string, accessToken: string) {
    try {
        const data = await patch(`/organisations/${organisationId}`, accessToken ?? '', { organisationName, organisationDescription })
        if (data.status === 'failed') {
            throw new Error(data.message)
        } else {
            revalidatePath('/settings/profile')
            return {
                status: "success",
                organisation: data.organisation
            }
        }
    } catch (error: any) {
        return {
            error: error?.message ?? 'An unknown error occurred'
        }
    }
}

export async function UpdateOrganisationProfileImage(organisationId: string, accessToken: string, body: FormData) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organisations/${organisationId}/upload-image`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
            body: body,
        })

        const data = await res.json()
        if (data.status === 'success') {
            revalidatePath('/settings/profile')
            return {
                status: 'success',
                message: "Image Uploaded"
            }
        } else {
            return {
                status: 'failed',
                message: data.message
            }
        }
    } catch (err: any) {
        return {
            error: err?.message ?? 'An unknown error occurred'
        }
    }

}