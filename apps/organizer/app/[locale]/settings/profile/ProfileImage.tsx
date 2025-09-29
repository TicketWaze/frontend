'use client'
import LoadingCircleSmall from '@workspace/ui/components/LoadingCircleSmall'
import { Image as ImageIcon, UserCirlceAdd } from 'iconsax-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import Cropper from 'react-easy-crop'
import { useCallback } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog"
import { ButtonPrimary } from '@workspace/ui/components/buttons'
import getCroppedImg from '@/lib/GetCroppedImage'
import { UpdateOrganisationProfileImage } from '@/actions/organisationActions'



function ProfileImage() {
    const t = useTranslations('Settings.profile')
    const { data: session, update } = useSession()
    const [isUploading, setIsUploading] = useState(false)
    // const organisation = useStore(organisationStore, organisationStore => organisationStore.state.organisation)
    const organisation = session?.activeOrganisation
    const triggerRef = useRef<HTMLSpanElement>(null)
    const CloseRef = useRef<HTMLSpanElement>(null)

    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const onCropComplete = useCallback((_: any, croppedPixels: any) => {
        setCroppedAreaPixels(croppedPixels)
    }, [])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        triggerRef.current?.click()
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            setImageSrc(reader.result as string)
        }
    }

    async function uploadImage() {
        setIsUploading(true)

        if (!imageSrc || !croppedAreaPixels) return
        const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
        const file = new File([croppedBlob], 'profile.jpg', { type: croppedBlob.type })

        const formData = new FormData()
        formData.append('user-profile', file)

        try {
            const response = await UpdateOrganisationProfileImage(organisation?.organisationId ?? '', session?.user.accessToken ?? '', formData)
            if (response.status === 'success') {
                toast.success(response.message)
                
                // Update the session with new profile image URL
                if (response.profileImageUrl) {
                    await update({
                        ...session,
                        activeOrganisation: {
                            ...session?.activeOrganisation,
                            profileImageUrl: response.profileImageUrl
                        }
                    })
                }
                
                // Alternative: Force session refresh if the response doesn't include the new URL
                // await update()
                
            } else {
                toast.error(response.message)
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : String(err))
        } finally {
            CloseRef.current?.click()
            setIsUploading(false)
            // Reset cropper state
            setImageSrc(null)
            setCrop({ x: 0, y: 0 })
            setZoom(1)
            setCroppedAreaPixels(null)
        }
    }


    return (
        <div className={'p-12 bg-primary-500 rounded-[30px] flex items-center gap-[25px]'}>
            <Dialog>
                <DialogTrigger className='sr-only' ><span ref={triggerRef} className='sr-only'>open</span></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('resize')}</DialogTitle>
                        <DialogDescription className='sr-only'>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </DialogDescription>
                        {imageSrc && (
                            <div className="relative w-full h-[300px]">
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                            </div>
                        )}
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose><span ref={CloseRef} className='sr-only'>Close</span></DialogClose>
                        <ButtonPrimary onClick={uploadImage} disabled={isUploading} className='w-full'>{isUploading ? <LoadingCircleSmall /> : t('resize')}</ButtonPrimary>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
                        key={organisation.profileImageUrl} // Force re-render when URL changes
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
                        onChange={handleFileChange}
                        className={'absolute top-0 left-0 w-full h-full opacity-0 z-50 cursor-pointer '}
                    />
                </form>
            </div>
        </div>
    )
}

export default ProfileImage