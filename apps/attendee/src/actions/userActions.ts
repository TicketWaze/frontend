'use server'
import { revalidatePath } from "next/cache"


export async function UpdateUserPreferences(accessToken: string, body: unknown) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/preferences`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(body),
        })

        const data = await res.json()
        
        if (data.status === 'success') {
            revalidatePath('/preferences')
            return {
                status : 'success',
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

export async function UpdateUserProfile(accessToken: string, body: unknown) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
            method: 'PATCH',
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
        const data = await res.json()
        
        if (data.status === 'success') {
            revalidatePath('/profile')
            return {
                status : 'success',
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