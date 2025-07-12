'use server'

import { patch } from "@/lib/Api"
import { revalidatePath } from "next/cache"

export async function UpdateOrganisationProfile(organisationId: string, organisationName: string, organisationDescription : string, accessToken: string) {
    try {
        const data = await patch(`/organisations/${organisationId}`, accessToken ?? '', { organisationName, organisationDescription })
        if (data.status === 'failed') {
            throw new Error(data.message)
        }else{
            return {
                status : "success",
                organisation : data.organisation
            }
        }
    } catch (error: any) {
        return {
            error: error?.message ?? 'An unknown error occurred'
        }
    }
    revalidatePath('/settings/profile')
}