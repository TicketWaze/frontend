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