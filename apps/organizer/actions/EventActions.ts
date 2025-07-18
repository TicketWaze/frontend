'use server'

import { api, patch, post } from "@/lib/Api"
import { revalidatePath } from "next/cache"

export async function CreateInPersonEvent(organisationId: string, accessToken: string, body : FormData) {
    try {
        const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/in-person/${organisationId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
            body: body

        })
        const response =  await request.json()
        console.log(response);
        
        if (response.status === 'success') {
            revalidatePath('/events')
            return {
                status: "success",
            }

        } else {
            throw new Error(response.message)
        }
    } catch (error: any) {
        return {
            error: error?.message ?? 'An unknown error occurred'
        }
    }
}