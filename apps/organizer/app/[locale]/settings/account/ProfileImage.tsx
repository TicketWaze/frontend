'use client'
import User from '@/types/User'
import { Image as ImageIcon, UserCirlceAdd } from 'iconsax-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { toast } from 'sonner'


function ProfileImage({ user }: { user: User }) {
  const t = useTranslations('Settings.account')

  return (
    <div className={'p-12 bg-primary-500 rounded-[30px] flex items-center gap-[25px]'}>
      {/* {user.profileImageUrl ? (
        <div
          className={
            'w-[80px] h-[80px] lg:w-[160px] lg:h-[160px] border-2 border-primary-600 overflow-hidden rounded-[25px] lg:rounded-[50px]'
          }
        >
          <img
            alt={user.firstName}
            className={'w-full h-full object-cover object-top'}
            src={user.profileImageUrl}
            loading={'eager'}
          />
        </div>
      ) : ( */}
        <>
          <div className={'p-8 hidden lg:block rounded-[50px] bg-primary-50'}>
            <UserCirlceAdd size={120} color={'#E45B00'} variant={'Bulk'} />
          </div>
          <div className={'p-4 lg:hidden rounded-[15px] bg-primary-50'}>
            <UserCirlceAdd size={35} color={'#E45B00'} variant={'Bulk'} />
          </div>
        </>
      {/* )} */}
      <div className={'flex flex-1 flex-col gap-[20px] lg:gap-[28px]'}>
        <span
          className={
            'font-primary font-medium lg:font-bold text-[2.6rem] lg:text-[4.5rem] leading-[30px] lg:leading-[50px] text-white'
          }
        >
          {user.firstName} {user.lastName}
        </span>
        <form
          encType={'multipart/form-data'}
          className={
            'px-[15px] lg:px-12 py-4 relative rounded-[100px] flex items-center justify-center gap-[5px] bg-black'
          }
        >
          <ImageIcon size="20" color="#ffffff" variant="Bulk" />
          <span className={'font-semibold text-[1.5rem] leading-8 text-white'}>
            {t('setProfile')}
          </span>
          <input
            type={'file'}
            accept={'image/*'}
            name={'image'}
            // onChange={(e) => {
            //   const file = e.target.files?.[0]
            //   if (file) {
            //     const formData = new FormData()
            //     formData.append('image', file)
            //     router.post('/settings/account/upload-image', formData, {
            //       forceFormData: true,
            //     })
            //   }
            // }}
            className={'absolute top-0 left-0 w-full h-full opacity-0 z-50 cursor-pointer '}
          />
        </form>
      </div>
    </div>
  )
}

export default ProfileImage
