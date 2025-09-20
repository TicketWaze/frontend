import LoadingCircleSmall from '@workspace/ui/components/LoadingCircleSmall'
import React from 'react'
import ClientContent from './ClientContent'

export default async function InvitePage({
    params,
}: {
    params: Promise<{ token: string }>
}) {
    const { token } = await params
    
    return (
        <div className='h-full flex items-center justify-center'>
            <ClientContent token={token}/>
        </div>
    )
}
