'use server'

import { revalidatePath } from "next/cache"

export async function AddEventToFavorite(accessToken: string, eventId: string, organisationId: string, pathname: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/favorites/${organisationId}`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
        const data = await res.json()

        if (data.status === 'success') {
            revalidatePath(pathname)
            return {
                status: 'success',
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

export async function RemoveEventToFavorite(accessToken: string, eventId: string, organisationId: string, pathname: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/favorites`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })
        const data = await res.json()

        if (data.status === 'success') {
            revalidatePath(pathname)
            return {
                status: 'success',
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

export async function AddReportEvent(accessToken: string, eventId: string, pathname: string, body : unknown) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/report`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body : JSON.stringify(body)
        })
        const data = await res.json()        

        if (data.status === 'success') {
            revalidatePath(pathname)
            return {
                status: 'success',
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