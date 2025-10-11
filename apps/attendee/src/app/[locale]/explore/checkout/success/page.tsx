'use client'
import AttendeeLayout from '@/components/Layouts/AttendeeLayout'
import React, { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import Slugify from '@/lib/Slugify'
import { toast } from 'sonner'
import PageLoader from '@/components/Loaders/PageLoader'

export default function SuccessMoncash() {
  const t = useTranslations('Checkout')
  const router = useRouter()
  const params = useSearchParams()
  const transactionId = params.get('transactionId')

  useEffect(function () {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/moncash/success/${transactionId}`)
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          toast.success("Success")
          router.push(`/upcoming/${Slugify(res.event.eventName)}`)
        } else {
          toast.error("Failed to retrieve payment")
          router.push(`/explore/${Slugify(res.event.eventName)}`)
        }
      })
  }, [])
  // setTimeout(function () {
  //   router.push('/upcoming')
  // }, 2000);
  return (
    <AttendeeLayout className='items-center justify-center' title=''>
      <PageLoader isLoading={true}/>
      {/* <div className='flex flex-col gap-16 items-center max-w-[530px]'>
        <Image src={Success} alt='success icon' width={150} height={150} />
        <div className='text-center flex flex-col gap-8'>
          <span className='font-primary font-medium text-[3.2rem] leading-12 text-black'>{t('purchased')}</span>
          <p className='text-[1.8rem] leading-8 text-neutral-700'>{t('purchased_text')}</p>
        </div>
        <div className=' flex items-center gap-4'>
          <LoadingCircleSmall />
          <span className='text-[1.8rem] leading-8 text-primary-500'>{t('purchased_cta')}</span>
        </div>
      </div> */}
    </AttendeeLayout>
  )
}
