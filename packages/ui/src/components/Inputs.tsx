'use client'
import { Eye, EyeSlash } from 'iconsax-react'
import React, { useState } from 'react'
import { cn } from '../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    children: React.ReactNode
    error? : string
    className? : string
    isLoading? : boolean
    disabled? : boolean
}

export function Input({ children, disabled, isLoading, className, error, ...props }: InputProps) {
    return (
        <div className={cn("relative group", className)}>
            <input {...props} placeholder=' ' disabled={isLoading ?? disabled ?? false} className={`peer transition-all duration-300 delay-200 bg-neutral-100 w-full rounded-[5rem] p-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border border-transparent focus:border-primary-500 disabled:text-neutral-700 disabled:border-none disabled:cursor-not-allowed ${isLoading ? 'animate-pulse' : null}`} />
            <label className="absolute left-8 top-8 text-[1.5rem] text-neutral-600 transition-all duration-200 ease-in-out peer-placeholder-shown:top-8 peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-[1.2rem] peer-focus:text-neutral-600 cursor-text pointer-events-none ">
                {children}
            </label>
            <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
                {error}
            </span>
        </div>
    )
}

export function PasswordInput({ children, isLoading, error, ...props }: InputProps) {
    const [showPassword, setShowPassword] = useState(false)
    return (
        <div className="relative group">
            <input {...props} disabled={isLoading} type={showPassword ? 'text' : 'password'} placeholder=' ' className="peer transition-all duration-300 delay-200 bg-neutral-100 w-full rounded-[5rem] p-8 text-[1.5rem] leading-[20px] placeholder:text-neutral-600 text-deep-200 outline-none border border-transparent focus:border-primary-500 disabled:text-neutral-700" />
            <label htmlFor="password" className="absolute left-8 top-8 text-[1.5rem] text-neutral-600 transition-all duration-200 ease-in-out peer-placeholder-shown:top-8 peer-placeholder-shown:text-gray-400 peer-focus:top-2.5 peer-focus:text-[1.2rem] peer-focus:text-neutral-600 cursor-text pointer-events-none ">
                {children}
            </label>
            <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
                {error}
            </span>
            <div className='absolute right-6 top-[50%] -translate-y-[50%]'>
                {showPassword ? (
                    <EyeSlash
                        onClick={() => setShowPassword(false)}
                        className={'cursor-pointer'}
                        size="20"
                        color="#232529"
                        variant="Bulk"
                    />
                ) : (
                    <Eye
                        onClick={() => setShowPassword(true)}
                        className={'cursor-pointer'}
                        size="20"
                        color="#232529"
                        variant="Bulk"
                    />
                )}
            </div>
        </div>
    )
}
