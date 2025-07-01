import React from 'react'
import { cn } from '@workspace/ui/lib/utils.js'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'px-[3rem] py-[15px] border-2 border-transparent rounded-[100px] text-center text-white font-medium text-[1.5rem] h-auto leading-[20px] cursor-pointer transition-all duration-400 flex items-center justify-center',
        className
      )}
    >
      {children}
    </button>
  )
}

export function ButtonPrimary({ children, className, ...props }: ButtonProps) {
  return (
    <Button {...props} className={cn('bg-primary-500 hover:bg-primary-500/80 hover:border-primary-600', className)}>
      {children}
    </Button>
  )
}

export function ButtonSecondary({ children, className, ...props }: ButtonProps) {
  return (
    <Button {...props} className={cn('bg-primary-50 border-primary-500 hover:border-primary-200  text-primary-500', className)}>
      {children}
    </Button>
  )
}

export function ButtonBlack({ children, className, ...props }: ButtonProps) {
  return (
    <Button {...props} className={cn('bg-[#000]', className)}>
      {children}
    </Button>
  )
}

export function ButtonAccent({ children, className, ...props }: ButtonProps) {
  return (
    <Button {...props} className={cn('border-primary-500 text-primary-500 bg-primary-50', className)}>
      {children}
    </Button>
  )
}

export function ButtonRed({ children, className, ...props }: ButtonProps) {
  return (
    <Button {...props} className={cn('border-failure text-failure bg-[#FCE5EA]', className)}>
      {children}
    </Button>
  )
}

export function ButtonNeutral({ children, className, ...props }: ButtonProps) {
  return (
    <Button {...props} className={cn('bg-neutral-100 text-neutral-700 hover:border-primary-500 hover:text-primary-500', className)}>
      {children}
    </Button>
  )
}

export function ButtonYellowSecondary({ children, className, ...props }: ButtonProps) {
  return (
    <Button {...props} className={cn('bg-warning/20 border-warning text-neutral-700 hover:bg-warning/30', className)}>
      {children}
    </Button>
  )
}