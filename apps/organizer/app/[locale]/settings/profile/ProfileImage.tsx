'use client'
import { UpdateUserProfileImage } from '@/actions/userActions'
import organisationStore from '@/store/OrganisationStore'
import Organisation from '@/types/Organisation'
import User from '@/types/User'
import { useStore } from '@tanstack/react-store'
import LoadingCircleSmall from '@workspace/ui/components/LoadingCircleSmall'
import { Image as ImageIcon, UserCirlceAdd } from 'iconsax-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'



function ProfileImage() {
  const t = useTranslations('Settings.account')
  const { data: session } = useSession()
  const [isUploading, setIsUploading] = useState(false)
  const organisation = useStore(organisationStore, organisationStore => organisationStore.state.organisation)
  
  

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    // setIsUploading(true)
    // const file = e.target.files?.[0];

    // if (!file) return

    // const formData = new FormData()
    // formData.append('user-profile', file)

    // try {
    //   const response = await UpdateUserProfileImage(session?.user.accessToken ?? '', formData)
    //   if(response.status === 'success'){
    //     toast.success(response.message)
    //   }else{
    //     toast.error(response.message)
    //   }
    // } catch (err) {
    //   toast.error(err instanceof Error ? err.message : String(err))
    // }
    // setIsUploading(false)
  }

  return (
    <div className={'p-12 bg-primary-500 rounded-[30px] flex items-center gap-[25px]'}>
      {organisation?.profileImageUrl ? (
        <div
          className={
            'w-[80px] h-[80px] lg:w-[160px] lg:h-[160px] border-2 border-primary-600 overflow-hidden rounded-[25px] lg:rounded-[50px]'
          }
        >
          <img
            alt={organisation.organisationName}
            className={'w-full h-full object-cover object-top'}
            src={organisation.profileImageUrl}
            loading={'eager'}
          />
        </div>
      ) : (
        <>
          <div className={'p-8 hidden lg:block rounded-[50px] bg-primary-50'}>
            <UserCirlceAdd size={120} color={'#E45B00'} variant={'Bulk'} />
          </div>
          <div className={'p-4 lg:hidden rounded-[15px] bg-primary-50'}>
            <UserCirlceAdd size={35} color={'#E45B00'} variant={'Bulk'} />
          </div>
        </>
      )}
      <div className={'flex flex-1 flex-col gap-[20px] lg:gap-[28px]'}>
        {organisation?.organisationName ? <span
          className={
            'font-primary font-medium lg:font-bold text-[2.6rem] lg:text-[4.5rem] leading-[30px] lg:leading-[50px] text-white'
          }
        >
          {organisation?.organisationName}
        </span> : <div className='h-[50px] w-full bg-primary-50/40 rounded-[30px] animate-pulse'></div>}
        <form
          encType={'multipart/form-data'}
          className={
            'px-[15px] lg:px-12 py-4 relative rounded-[100px] flex items-center justify-center gap-[5px] bg-black'
          }
        >
          {isUploading ? <LoadingCircleSmall /> :
            <>
              <ImageIcon size="20" color="#ffffff" variant="Bulk" />
              <span className={'font-semibold text-[1.5rem] leading-8 text-white'}>
                {t('setProfile')}
              </span>
            </>}
          <input
            type={'file'}
            accept={'image/*'}
            name={'user-profile'}
            onChange={uploadImage}
            className={'absolute top-0 left-0 w-full h-full opacity-0 z-50 cursor-pointer '}
          />
        </form>
      </div>
    </div>
  )
}

export default ProfileImage
