'use server'

import { patch } from "@/lib/Api"
import { revalidatePath } from "next/cache"

export async function UpdateUserProfile(firstName: string, lastName: string, phoneNumber: string, accessToken: string) {
    try {
        const data = await patch('/users/me', accessToken ?? '', { firstName, lastName, phoneNumber })
        if (data.status === 'failed') {
            throw new Error(data.message)
        }
    } catch (error: any) {
        return {
            error: error?.message ?? 'An unknown error occurred'
        }
    }
    revalidatePath('/settings/account')
}

export async function UpdateUserProfileImage(accessToken: string, body: FormData) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/upload-image`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
            body: body,
        })

        const data = await res.json()
        if (data.status === 'success') {
            revalidatePath('/settings/account')
            return {
                status : 'success',
                message: "Image Uploaded"
            }
        } else {
            return {
                status : 'failed',
                message: data.message
            }
        }
    } catch (err: any) {
        return {
            error: err?.message ?? 'An unknown error occurred'
        }
    }

}