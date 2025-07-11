export async function api(endpoint: string, accessToken : string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        cache: 'no-store',
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${accessToken}`
        },

    })
    return await response.json()
}

export async function post(endpoint: string, accessToken : string, body : unknown) {
     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${accessToken}`
        },
        body : JSON.stringify(body)

    })
    return await response.json()
}

export async function patch(endpoint: string, accessToken : string, body : unknown) {
     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${accessToken}`,
        },
        body : JSON.stringify(body)

    })
    return await response.json()
}