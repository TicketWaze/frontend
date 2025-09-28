'use client'
import { AddEventToFavorite, AddReportEvent, RemoveEventToFavorite } from '@/actions/eventActions'
import NoAuthDialog from '@/components/Layouts/NoAuthDialog'
import { LinkPrimary } from '@/components/Links'
import PageLoader from '@/components/Loaders/PageLoader'
import { usePathname } from '@/i18n/navigation'
import Slugify from '@/lib/Slugify'
import TruncateUrl from '@/lib/TruncateUrl'
import Event from '@/types/Event'
import User from '@/types/User'
import { zodResolver } from '@hookform/resolvers/zod'
import { ButtonNeutral, ButtonPrimary } from '@workspace/ui/components/buttons'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog'
import LoadingCircleSmall from '@workspace/ui/components/LoadingCircleSmall'
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover'
import { Copy, Heart, MoreCircle, Send2, Warning2 } from 'iconsax-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

export default function EventActions({ event, user, isFavorite }: { event: Event; user: User; isFavorite: boolean }) {
  const t = useTranslations("Event")
  const [currentUrl, setCurrentUrl] = useState('')
  const { data: session } = useSession()
  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  async function AddToFavorite() {
    setIsLoading(true)
    const result = await AddEventToFavorite(user.accessToken, event.eventId, event.organisationId, pathname)
    if (result.error) {
      toast.error(result.message)
    }

    setIsLoading(false)
  }

  async function RemoveToFavorite() {
    setIsLoading(true)
    const result = await RemoveEventToFavorite(user.accessToken, event.eventId, event.organisationId, pathname)
    if (result.error) {
      toast.error(result.message)
    }

    setIsLoading(false)
  }

  const ReportEventSchema = z.object({
    status: z.enum(
      [
        t("inappropriateContent"),
        t("misleadingInformation"),
        t("fraud"),
        t("venue"),
      ] as const,
      { error: t('validStatus') }
    ),
  });

  type TReportEventSchema = z.infer<typeof ReportEventSchema>

  const { register, handleSubmit, formState: { errors } } = useForm<TReportEventSchema>({
    resolver: zodResolver(ReportEventSchema),
  });

  const closeReportRef = useRef<HTMLButtonElement>(null)

  async function ReportEvent(data: TReportEventSchema) {
    setIsLoading(true)
    const result = await AddReportEvent(user.accessToken, event.eventId, pathname, { message: data.status, organisationId: event.organisationId })

    if (result.status !== 'success') {
      toast.error(result.message)
    } else {
      closeReportRef.current?.click()
    }

    setIsLoading(false)
  }
  return (
    <div className='flex items-center justify-between'>
      <PageLoader isLoading={isLoading} />
      <div className='flex  gap-8'>
        <Dialog>
          <DialogTrigger>
            <span className='px-[15px] py-[7.5px] border-2 border-transparent rounded-[100px] text-center font-medium text-[1.5rem] h-auto leading-[20px] cursor-pointer transition-all duration-400 flex items-center justify-center gap-4 bg-neutral-100 text-neutral-700'>
              <Send2 variant={'Bulk'} color={'#737C8A'} size={20} />
              <span className='hidden lg:inline'>{t('share')}</span>
            </span>
          </DialogTrigger>
          <DialogContent className={'w-[360px] lg:w-[520px] '}>
            <DialogHeader>
              <DialogTitle
                className={
                  'font-medium border-b border-neutral-100 pb-[2rem]  text-[2.6rem] leading-[30px] text-black font-primary'
                }
              >
                {t('share')}
              </DialogTitle>
              <DialogDescription className={'sr-only'}>
                <span>Share event</span>
              </DialogDescription>
            </DialogHeader>
            <div className={'flex flex-col w-auto justify-center items-center gap-[30px]'}>
              <p
                className={
                  'font-sans text-[1.8rem] leading-[25px] text-[#cdcdcd] text-center w-[320px] lg:w-full'
                }
              >
                {t('share_text')}
              </p>
              <div
                className={
                  'border w-auto border-neutral-100 rounded-[100px] p-4 flex  items-center gap-4'
                }
              >
                <span className={'lg:hidden text-neutral-700 text-[1.8rem] max-w-[335px]'}>
                  {TruncateUrl(currentUrl, 22)}
                </span>
                <span
                  className={'hidden lg:block text-neutral-700 text-[1.8rem] max-w-[335px]'}
                >
                  {TruncateUrl(currentUrl)}
                </span>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(currentUrl)
                      toast.success('Url copied to clipboard')
                    } catch (e) {
                      toast.error('Failed to copy url')
                    }
                  }}
                  className={
                    'border-2 border-primary-500 px-[15px] py-[7px] rounded-[10rem] font-normal text-[1.5rem] text-primary-500 leading-[20px] bg-primary-50 cursor-pointer flex'
                  }
                >
                  <Copy size="20" color="#e45b00" variant="Bulk" />
                  {t('copy')}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {session?.user && isFavorite && <button disabled={isLoading} onClick={RemoveToFavorite} className='w-[35px] h-[35px] group flex items-center justify-center rounded-[30px] cursor-pointer bg-primary-100'>
          <Heart size="20" color='#E45B00' variant="Bulk" />
        </button>}
        {session?.user && !isFavorite && <button disabled={isLoading} onClick={AddToFavorite} className='w-[35px] h-[35px] group flex items-center justify-center bg-neutral-100 rounded-[30px] cursor-pointer hover:bg-primary-100 transition-all ease-in-out duration-500'>
          <Heart size="20" className='"stroke-neutral-700 fill-neutral-700 group-hover:stroke-primary-500 group-hover:fill-primary-500 transition-all ease-in-out duration-500' variant="Bulk" />
        </button>}
        {!session?.user && <Dialog>
          <DialogTrigger>
            <span className='w-[35px] h-[35px] group flex items-center justify-center bg-neutral-100 rounded-[30px] cursor-pointer hover:bg-primary-100 transition-all ease-in-out duration-500'>
              <Heart size="20" className='"stroke-neutral-700 fill-neutral-700 group-hover:stroke-primary-500 group-hover:fill-primary-500 transition-all ease-in-out duration-500' variant="Bulk" />
            </span>
          </DialogTrigger>
          <NoAuthDialog />
        </Dialog>}

        <Popover>
          <PopoverTrigger asChild>
            <span className='w-[35px] h-[35px] group flex items-center justify-center bg-neutral-100 rounded-[30px] cursor-pointer hover:bg-primary-100 transition-all ease-in-out duration-500'>
              <MoreCircle variant={'Bulk'} color={'#737C8A'} size={20} />
              {/* {t('more')} */}
            </span>
          </PopoverTrigger>
          <PopoverContent className={
            'bg-neutral-100 border border-neutral-200 right-8 p-4 pb-8 w-[230px]  mb-8 rounded-[1rem] shadow-xl bottom-full flex flex-col gap-4'}>
            <span
              className={
                'font-medium py-[5px] border-b-[1px] border-neutral-200 text-[1.4rem] text-deep-100 leading-[20px]'
              }
            >
              {t('more')}
            </span>

            {session?.user ?
              <Dialog>
                <form>
                  <DialogTrigger asChild>
                    <div className='flex items-center gap-4 cursor-pointer'>
                      <Warning2 size="20" color="#DE0028" variant="Bulk" />
                      <span className='text-[1.4rem] leading-8 text-failure' >{t('reportEvent')}</span>
                    </div>
                  </DialogTrigger>
                  <DialogContent className='flex flex-col gap-8'>
                    <DialogHeader>
                      <DialogTitle>{t('reportEvent')}</DialogTitle>
                      <DialogDescription className=' text-[1.8rem] leading-8 text-neutral-400 text-center'>
                        {t('reportEventDescription')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col gap-8'>
                      <label
                        htmlFor="inappropriateContent"
                        // name="status"
                        className="font-medium cursor-pointer  relative bg-neutral-100 hover:bg-zinc-100 flex items-center px-4 py-[1.5rem] gap-3 rounded-[10px] text-[1.6rem] leading-8 text-deep-100 has-[:checked]:bg-white has-[:checked]:ring-primary-500 has-checked:shadow-lg has-[:checked]:ring-1 select-none"
                      >
                        {t('inappropriateContent')}
                        <input
                          type="radio"
                          className="peer/html w-4 h-4 opacity-0 absolute accent-current right-3"
                          id="inappropriateContent"
                          value={t('inappropriateContent')}
                          {...register('status')}
                        />
                      </label>
                      <label
                        htmlFor="misleadingInformation"
                        // name="status"
                        className="font-medium cursor-pointer  relative bg-neutral-100 hover:bg-zinc-100 flex items-center px-4 py-[1.5rem] gap-3 rounded-[10px] text-[1.6rem] leading-8 text-deep-100 has-[:checked]:bg-white has-[:checked]:ring-primary-500 has-checked:shadow-lg has-[:checked]:ring-1 select-none"
                      >
                        {t('misleadingInformation')}
                        <input
                          type="radio"
                          className="peer/html w-4 h-4 opacity-0 absolute accent-current right-3"
                          id="misleadingInformation"
                          value={t('misleadingInformation')}
                          {...register('status')}
                        />
                      </label>
                      <label
                        htmlFor="fraud"
                        // name="status"
                        className="font-medium cursor-pointer  relative bg-neutral-100 hover:bg-zinc-100 flex items-center px-4 py-[1.5rem] gap-3 rounded-[10px] text-[1.6rem] leading-8 text-deep-100 has-[:checked]:bg-white has-[:checked]:ring-primary-500 has-checked:shadow-lg has-[:checked]:ring-1 select-none"
                      >
                        {t('fraud')}
                        <input
                          type="radio"
                          className="peer/html w-4 h-4 opacity-0 absolute accent-current right-3"
                          id="fraud"
                          value={t('fraud')}
                          {...register('status')}
                        />
                      </label>
                      <label
                        htmlFor="venue"
                        // name="status"
                        className="font-medium cursor-pointer  relative bg-neutral-100 hover:bg-zinc-100 flex items-center px-4 py-[1.5rem] gap-3 rounded-[10px] text-[1.6rem] leading-8 text-deep-100 has-[:checked]:bg-white has-[:checked]:ring-primary-500 has-checked:shadow-lg has-[:checked]:ring-1 select-none"
                      >
                        {t('venue')}
                        <input
                          type="radio"
                          className="peer/html w-4 h-4 opacity-0 absolute accent-current right-3"
                          id="venue"
                          value={t('venue')}
                          {...register('status')}
                        />
                      </label>
                      <span className={"text-[1.2rem] px-8 py-2 text-failure"}>
                        {errors.status?.message}
                      </span>
                    </div>

                    <DialogFooter className=''>
                      <DialogClose ref={closeReportRef} asChild>
                        <ButtonNeutral>{t('back')}</ButtonNeutral>
                      </DialogClose>
                      <ButtonPrimary type="submit" onClick={handleSubmit(ReportEvent)}>{isLoading ? <LoadingCircleSmall /> : t('reportEvent')}</ButtonPrimary>
                    </DialogFooter>
                  </DialogContent>
                </form>
              </Dialog>
              :
              <Dialog>
                <DialogTrigger>
                  <div className='flex items-center gap-4 cursor-pointer'>
                    <Warning2 size="20" color="#DE0028" variant="Bulk" />
                    <span className='text-[1.4rem] leading-8 text-failure' >{t('reportEvent')}</span>
                  </div>
                </DialogTrigger>
                <NoAuthDialog />
              </Dialog>
            }
            <div className='h-[1px] bg-neutral-200 w-full'></div>

            {session?.user ?
              <div className='flex items-center gap-4'>
                <Warning2 size="20" color="#DE0028" variant="Bulk" />
                <span className='text-[1.4rem] leading-8 text-failure' >{t('reportOrg')}</span>
              </div>
              :
              <Dialog>
                <DialogTrigger>
                  <div className='flex items-center gap-4'>
                    <Warning2 size="20" color="#DE0028" variant="Bulk" />
                    <span className='text-[1.4rem] leading-8 text-failure' >{t('reportOrg')}</span>
                  </div>
                </DialogTrigger>
                <NoAuthDialog />
              </Dialog>
            }
          </PopoverContent>
        </Popover>

      </div>
      {session?.user ?
        <LinkPrimary href={`/explore/${Slugify(event.eventName)}/checkout`}>{t('buy')}</LinkPrimary> :
        <Dialog>
          <DialogTrigger>
            <span className='px-[3rem] py-[15px] border-2 border-transparent rounded-[100px] text-center text-white font-medium text-[1.5rem] h-auto leading-[20px] cursor-pointer transition-all duration-400 flex items-center justify-center bg-primary-500 disabled:bg-primary-500/50 hover:bg-primary-500/80 hover:border-primary-600'>{t('buy')}</span>
          </DialogTrigger>
          <NoAuthDialog />
        </Dialog>
      }

    </div>
  )
}
