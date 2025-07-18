import React from 'react'

export function SimpleTopbar({ title }: { title: string }) {
    return (
        <header>
            <span className='font-primary font-medium text-[1.8rem] lg:text-[2.6rem] leading-[2.5rem] lg:leading-12 text-black'>{title}</span>
        </header>
    )
}
