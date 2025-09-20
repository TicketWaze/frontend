'use server'

import { api, patch, post } from "@/lib/Api"
import { revalidatePath } from "next/cache"

export async function UpdateOrganisationProfile(organisationId: string, organisationName: string, organisationDescription: string, accessToken: string) {
    try {
        const data = await patch(`/organisations/${organisationId}`, accessToken ?? '', { organisationName, organisationDescription })
        if (data.status === 'success') {
            revalidatePath('/settings/profile')
            return {
                status: "success",
                organisation: data.organisation
            }

        } else {
            throw new Error(data.message)
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

export async function UpdateOrganisationPaymentInformation(organisationId: string, bankName: string, bankAccountName: string, bankAccountNumber: string, accessToken: string) {
    try {
        const data = await patch(`/organisations/${organisationId}/payment-informations`, accessToken ?? '', { bankName, bankAccountName, bankAccountNumber })

        if (data.status === 'success') {
            revalidatePath('/settings/payment')
            return {
                status: "success",
            }

        } else {
            throw new Error(data.message)
        }
    } catch (error: any) {
        return {
            error: error?.message ?? 'An unknown error occurred'
        }
    }
}

export async function UpdateOrganisationNotificationPreferences(organisationId: string, body: unknown, accessToken: string) {
    try {
        const data = await patch(`/organisations/${organisationId}/notifications-preferences`, accessToken ?? '', body)

        if (data.status === 'success') {
            revalidatePath('/settings/notification')
            return {
                status: "success",
            }

        } else {
            throw new Error(data.message)
        }
    } catch (error: any) {
        return {
            error: error?.message ?? 'An unknown error occurred'
        }
    }
}

export async function AddMemberAction(organisationId: string, body: unknown, accessToken: string, locale: string, origin: string) {
    try {
        const data = await post(`/organisations/${organisationId}/invite-user`, accessToken ?? '', body, locale, origin)
        if (data.status === 'success') {
            revalidatePath('/settings/team')
            return {
                status: "success",
            }

        } else {
            throw new Error(data.message)
        }
    } catch (error: any) {
        return {
            error: error?.message ?? 'An unknown error occurred'
        }
    }
}

export async function EditMemberAction(organisationId: string, userId: string, accessToken: string, role: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organisations/${organisationId}/update-role/${userId}/${role}`, {
            method: 'PATCH',
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
        })
        const data = await res.json()
        if (data.status === 'success') {
            revalidatePath('/settings/team')
            return {
                status: "success",
            }

        } else {
            throw new Error(data.message)
        }
    } catch (error: any) {
        return {
            error: error?.message ?? 'An unknown error occurred'
        }
    }
}

export async function RemoveInvitation(organisationId: string, accessToken: string, email: string, locale: string, origin: string) {
    try {
        const data = await api(`/organisations/${organisationId}/remove-invite/${email}`, accessToken ?? '', locale, origin)

        if (data.status === 'success') {
            revalidatePath('/settings/team')
            return {
                status: "success",
            }

        } else {
            throw new Error(data.message)
        }
    } catch (error: any) {
        return {
            error: error?.message ?? 'An unknown error occurred'
        }
    }
}

export async function RemoveMemberQuery(organisationId: string, accessToken: string, email: string, locale: string, origin: string) {
    try {
        const data = await api(`/organisations/${organisationId}/remove-member/${email}`, accessToken ?? '', locale, origin)

        if (data.status === 'success') {
            revalidatePath('/settings/team')
            return {
                status: "success",
            }

        } else {
            throw new Error(data.message)
        }
    } catch (error: any) {
        return {
            error: error?.message ?? 'An unknown error occurred'
        }
    }
}



