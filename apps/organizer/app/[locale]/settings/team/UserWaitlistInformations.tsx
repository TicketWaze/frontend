'use client'
import Separator from "@/components/Separator"
import FormatDate from "@/lib/FormatDate"
import GetRoleName from "@/lib/GetRoleName"
import WaitlistMember from "@/types/WaitlistMember"
import { Dialog, DialogTrigger } from "@workspace/ui/components/dialog"
import { DrawerContent, DrawerFooter, DrawerTitle, DrawerDescription } from "@workspace/ui/components/drawer"
import { useTranslations } from "next-intl"
import RemoveInvitationDrawerContent from "./RemoveInvitationDialogContent"
export default function UserWaitlistInformation({ member }: { member: WaitlistMember }) {
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
                        {member.fullName}
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
                                {member.fullName}
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
                            <span className={'text-deep-100 font-medium leading-[20px]'}>{GetRoleName(member.role)}</span>
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
                            <span className={'text-deep-100 font-medium leading-[20px]'}>{FormatDate(member.createdAt)}</span>
                        </span>
                        <span
                            className={
                                'flex justify-between items-center text-[1.4rem] leading-[20px] text-neutral-600'
                            }
                        >
                            {t('table.status')}
                            <span
                                className={
                                    'py-[3px] text-[1.1rem] font-bold leading-[15px] text-center uppercase text-[#EA961C]  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                                }
                            >
                                {t('invited')}
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
                            <span className={'w-full border-failure text-failure bg-[#FCE5EA] px-[3rem] py-[15px] border-2 rounded-[100px] text-center font-medium text-[1.5rem] h-auto leading-[20px] cursor-pointer transition-all duration-400 flex items-center justify-center'}>{t('remove_invitation')}</span>
                        </DialogTrigger>
                        <RemoveInvitationDrawerContent email={member.email} />
                    </Dialog>
                </div>
            </DrawerFooter>
            {/* )} */}
        </DrawerContent>
    )
}