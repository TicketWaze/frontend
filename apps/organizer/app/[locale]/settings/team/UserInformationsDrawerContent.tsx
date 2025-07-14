'use client'
import Separator from "@/components/Separator"
import FormatDate from "@/lib/FormatDate"
import OrganisationMember from "@/types/OrganisationMember"
import { ButtonPrimary, ButtonRed } from "@workspace/ui/components/buttons"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog"
import { DrawerContent, DrawerFooter,DrawerTitle,DrawerDescription } from "@workspace/ui/components/drawer"
import { useTranslations } from "next-intl"
export default function UserInformation({ member }: { member: OrganisationMember }) {
  const t = useTranslations('Settings.team')
  return (
    <DrawerContent className={'w-[360px] lg:w-[520px] bg-white my-6 p-[30px] rounded-[30px]'}>
      <div className={'w-full flex flex-col items-center overflow-y-scroll'}>
        <DrawerTitle className={'pb-[40px]'}>
          <span
            className={
              'font-primary font-medium text-center text-[2.6rem] leading-[30px] text-black'
            }
          >
            {member.firstName}
          </span>
        </DrawerTitle>
        <DrawerDescription className={'w-full'}>
          <span className={'w-full flex flex-col gap-8'}>
            <span
              className={
                'flex justify-between items-center text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('table.name')}
              <span className={'text-deep-100 font-medium leading-[20px]'}>
                {member.firstName} {member.lastName}
              </span>
            </span>
            <span
              className={
                'flex justify-between items-center text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('table.email')}
              <span className={'text-deep-100 font-medium leading-[20px]'}>{member.email}</span>
            </span>
            <span
              className={
                'flex justify-between items-center text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('table.role')}
              <span className={'text-deep-100 font-medium leading-[20px]'}>{member.role}</span>
            </span>
          </span>
          <Separator />
          <span className={'w-full flex flex-col gap-8'}>
            
            <span
              className={
                'flex justify-between items-center text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
             {t('added_by')}
              <span className={'text-deep-100 font-medium leading-[20px]'}>{member.addedBy}</span>
            </span>
            <span
              className={
                'flex justify-between items-center text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('joined_at')}
              <span className={'text-deep-100 font-medium leading-[20px]'}>{FormatDate(member.joinedAt)}</span>
            </span>
            <span
              className={
                'flex justify-between items-center text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('table.status')}
                <span
                  className={
                    'py-[3px] text-[1.1rem]  font-bold leading-[15px] text-center uppercase text-[#349C2E]  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                  }
                >
                  {t('active')}
                </span>
            </span>
            <span
              className={
                'flex justify-between items-start text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('last_login')}
              <span className={'text-deep-100 font-medium leading-[20px] max-w-[399px] text-right'}>
                {FormatDate(member.lastLogin)}
              </span>
            </span>
          </span>
        </DrawerDescription>
      </div>

      {/* {isAdmin && ( */}
        <DrawerFooter>
          <div className={'flex gap-8 w-full items-center'}>
            <Dialog>
              <DialogTrigger className={'w-full flex-1'}>
                <span className={'w-full border-failure text-failure bg-[#FCE5EA] px-[3rem] py-[15px] border-2 rounded-[100px] text-center font-medium text-[1.5rem] h-auto leading-[20px] cursor-pointer transition-all duration-400 flex items-center justify-center'}>{t('remove')}</span>
              </DialogTrigger>
              <DialogContent className={'w-[360px] lg:w-[520px] '}>
                <DialogHeader>
                  <DialogTitle
                    className={
                      'font-medium border-b border-neutral-100 pb-[2rem]  text-[2.6rem] leading-[30px] text-black font-primary'
                    }
                  >
                    {t('remove_member')}
                  </DialogTitle>
                  <DialogDescription className={'sr-only'}>
                    <span>Share event</span>
                  </DialogDescription>
                </DialogHeader>
                <div
                  className={
                    'flex flex-col w-auto justify-center items-center pt-[25px] gap-[30px]'
                  }
                >
                  <p className={'text-[1.8rem] leading-[25px] text-gray-400'}>
                    {t('confirm_text')}
                  </p>
                  <ButtonRed className={'w-full'}>{t('confirm')}</ButtonRed>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger className={'w-full flex-1'}>
                <span className={'w-full bg-primary-500 disabled:bg-primary-500/50 hover:bg-primary-500/80 hover:border-primary-600 px-[3rem] py-[15px] border-2 border-transparent rounded-[100px] text-center text-white font-medium text-[1.5rem] h-auto leading-[20px] cursor-pointer transition-all duration-400 flex items-center justify-center'}>{t('edit')}</span>
              </DialogTrigger>
              {/* <EditMemberDialogContent userId={member.user_id} defaultRole={member.role} /> */}
            </Dialog>
          </div>
        </DrawerFooter>
      {/* )} */}
    </DrawerContent>
  )
}