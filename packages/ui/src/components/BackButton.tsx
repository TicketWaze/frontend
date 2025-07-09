'use client'
import React from 'react'
import { ArrowLeft2 } from 'iconsax-react'
import { cn } from '../lib/utils'

function BackButton({
    text,
    className,
    onClick
}: {
    text: string
    className?: string
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}) {
    return (
        <button
            onClick={onClick ? onClick : () => window.history.back()}
            className={cn('flex max-w-[80px] cursor-pointer items-center gap-4', className)}
        >
            <div
                className={
                    'w-[35px] h-[35px] rounded-full bg-neutral-100 flex items-center justify-center'
                }
            >
                <ArrowLeft2 size="20" color="#0d0d0d" variant="Bulk" />
            </div>
            <span className={'text-neutral-700 font-normal text-[1.4rem] leading-8'}>
                {text}
            </span>
        </button>
    )
}

export default BackButton
