'use client'
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import OrganisationMember from '@/types/OrganisationMember'
import { Edit2, MoreCircle, Trash } from 'iconsax-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog'
import { Drawer, DrawerTrigger } from '@workspace/ui/components/drawer'
import UserInformation from './UserInformationsDrawerContent'
import WaitlistMember from '@/types/WaitlistMember'
import UserWaitlistInformation from './UserWaitlistInformations'
import GetRoleName from '@/lib/GetRoleName'
import RemoveInvitationDialogContent from './RemoveInvitationDialogContent'
import RemoveMember from './RemoveMember'
import EditMemberDialogContent from './EditMemberDialogContent'
import User from '@/types/User'

export default function MemberList({ members, waitlistMembers }: { members: OrganisationMember[], waitlistMembers: WaitlistMember[] }) {
  const t = useTranslations('Settings.team')
  const { data: session } = useSession()
  return (
    <main className='min-h-[70dvh]'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className={
                'font-bold text-[1.1rem] w-[230px] pb-[15px] leading-[15px] text-deep-100 uppercase'
              }
            >
              {t('table.name')}
            </TableHead>
            <TableHead
              className={
                'font-bold hidden lg:table-cell text-[1.1rem] w-[280px] pb-[15px] leading-[15px] text-deep-100 uppercase'
              }
            >
              {t('table.email')}
            </TableHead>
            <TableHead
              className={
                'font-bold text-[1.1rem] w-[230px] pb-[15px] leading-[15px] text-deep-100 uppercase'
              }
            >
              {t('table.role')}
            </TableHead>
            <TableHead
              className={
                'font-bold hidden lg:table-cell text-[1.1rem] w-[230px] pb-[15px] leading-[15px] text-deep-100 uppercase'
              }
            >
              {t('table.status')}
            </TableHead>
            <TableHead
              className={
                'font-bold hidden lg:table-cell text-[1.1rem] w-[50px] pb-[15px] leading-[15px] text-deep-100 uppercase'
              }
            >
              <span className={'opacity-0'}>Action</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member, key: number) => (
            <TableRow key={key}>
              <TableCell className={'text-[1.5rem] py-[15px] leading-8 text-neutral-900'}>
                <Drawer direction={'right'}>
                  <DrawerTrigger>
                    <span className={'cursor-pointer flex items-center gap-4'}>
                      {member.firstName} {member.lastName}
                      {session?.user.userId === member.userId && (
                        <span
                          className={
                            'py-[3px] text-[1.1rem] font-bold leading-[15px] text-center uppercase text-primary-500  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                          }
                        >
                          {t('you')}
                        </span>
                      )}
                    </span>
                  </DrawerTrigger>
                  <UserInformation member={member} />
                </Drawer>
              </TableCell>
              <TableCell className={'text-[1.5rem] hidden lg:table-cell leading-8 text-neutral-900'}>
                <Drawer direction={'right'}>
                  <DrawerTrigger>
                    <span className={'cursor-pointer'}>{member.email}</span>
                  </DrawerTrigger>
                  <UserInformation member={member} />
                </Drawer>
              </TableCell>
              <TableCell
                className={
                  'text-[1.5rem]  font-medium leading-8 text-neutral-900'
                }
              >
                {member.role}
              </TableCell>
              <TableCell className={'hidden lg:table-cell'}>
                <span
                  className={
                    'py-[3px] text-[1.1rem]  font-bold leading-[15px] text-center uppercase text-[#349C2E]  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                  }
                >
                  Active
                </span>
              </TableCell>
              {session?.user.userId !== member.userId && <TableCell
                className={'text-[1.5rem] hidden lg:table-cell leading-8 text-neutral-900'}
              >
                {/* {isAdmin && user.userId != member.user_id && ( */}
                <Popover>
                  <PopoverTrigger>
                    <div
                      className={
                        'w-[20px] h-[20px] cursor-pointer flex items-center justify-center rounded-full bg-neutral-100'
                      }
                    >
                      <MoreCircle size="10" color="#737C8A" variant="Bulk" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className={
                      'w-[236px] p-0 m-0 bg-none right-8 shadow-none border-none mx-4'
                    }
                  >
                    <div
                      className={
                        'bg-neutral-100 p-4 rounded-[1rem] shadow-xl flex flex-col gap-4'
                      }
                    >
                      <span
                        className={
                          'font-medium py-[5px] border-b-[1px] border-neutral-200 text-[1.4rem] text-deep-100 leading-[20px]'
                        }
                      >
                        {t('more')}
                      </span>
                      <ul className={'flex flex-col gap-4'}>
                        <li>
                          <Dialog>
                            <DialogTrigger
                              className={`font-normal group text-[1.4rem] py-4 leading-[20px] text-primary-500 flex items-center justify-between gap-4 w-full cursor-pointer  border-b-[1px] border-neutral-200`}
                            >
                              <span className={''}>{t('edit')}</span>
                              <Edit2 size="20" variant="Bulk" color={'#E45B00'} />
                            </DialogTrigger>
                            <EditMemberDialogContent
                                userId={member.userId}
                                defaultRole={member.role}
                                user={session?.user as User}
                              />
                          </Dialog>
                        </li>
                        <li>
                          <Dialog>
                            <DialogTrigger className={'w-full flex-1'}>
                              <span
                                className={`font-normal w-full cursor-pointer group text-[1.4rem] py-4 leading-[20px] text-failure flex items-center justify-between gap-4`}
                              >
                                <span className={''}>{t('remove')}</span>
                                <Trash size="20" variant="Bulk" color={'#DE0028'} />
                              </span>
                            </DialogTrigger>
                            <DialogContent className={'w-[360px] lg:w-[520px] '}>
                              <DialogHeader>
                                <DialogTitle
                                  className={
                                    'font-medium border-b border-neutral-100 pb-[2rem]  text-[2.6rem] leading-[30px] text-black font-primary'
                                  }
                                >
                                  {t('remove')}
                                </DialogTitle>
                                <DialogDescription className={'sr-only'}>
                                  <span>Remove member</span>
                                </DialogDescription>
                              </DialogHeader>
                              <RemoveMember email={member.email}/>
                            </DialogContent>
                          </Dialog>
                        </li>
                      </ul>
                    </div>
                  </PopoverContent>
                </Popover>
                {/* ))} */}
              </TableCell> }
              
            </TableRow>
          ))}

          {/* Waitlist member */}
          {waitlistMembers.map((member, key: number) => (
            <TableRow key={key}>
              <TableCell className={'text-[1.5rem] py-[15px] leading-8 text-neutral-900'}>
                <Drawer direction={'right'}>
                  <DrawerTrigger>
                    <span className={'cursor-pointer flex items-center gap-4'}>
                      {member.fullName}
                    </span>
                  </DrawerTrigger>
                  <UserWaitlistInformation member={member} />
                </Drawer>

              </TableCell>
              <TableCell className={'text-[1.5rem] hidden lg:table-cell leading-8 text-neutral-900'}>
                <Drawer direction={'right'}>
                  <DrawerTrigger>
                    <span className={'cursor-pointer'}>{member.email}</span>
                  </DrawerTrigger>
                  <UserWaitlistInformation member={member} />
                </Drawer>
              </TableCell>
              <TableCell
                className={
                  'text-[1.5rem]  font-medium leading-8 text-neutral-900'
                }
              >
                {GetRoleName(member.role)}
              </TableCell>
              <TableCell className={'hidden lg:table-cell'}>
                <span
                  className={
                    'py-[3px] text-[1.1rem] font-bold leading-[15px] text-center uppercase text-[#EA961C]  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                  }
                >
                  {t('invited')}
                </span>
              </TableCell>
              <TableCell
                className={'text-[1.5rem] hidden lg:table-cell leading-8 text-neutral-900'}
              >
                <Popover>
                  <PopoverTrigger>
                    <div
                      className={
                        'w-[20px] h-[20px] cursor-pointer flex items-center justify-center rounded-full bg-neutral-100'
                      }
                    >
                      <MoreCircle size="10" color="#737C8A" variant="Bulk" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className={'w-[236px] p-0 m-0 bg-none right-8 shadow-none border-none mx-4'}
                  >
                    <div
                      className={
                        'bg-neutral-100 p-4 rounded-[1rem] shadow-xl flex flex-col gap-4'
                      }
                    >
                      <span
                        className={
                          'font-medium py-[5px] border-b-[1px] border-neutral-200 text-[1.4rem] text-deep-100 leading-[20px]'
                        }
                      >
                        {t('more')}
                      </span>
                      <ul className={'flex flex-col gap-4'}>
                        <li>
                          <Dialog>
                            <DialogTrigger className={'w-full flex-1'}>
                              <span
                                className={`font-normal w-full cursor-pointer group text-[1.4rem] py-4 leading-[20px] text-failure flex items-center justify-between gap-4`}
                              >
                                <span className={''}>{t('remove_invitation')}</span>
                                <Trash size="20" variant="Bulk" color={'#DE0028'} />
                              </span>
                            </DialogTrigger>
                            <DialogContent className={'w-[360px] lg:w-[520px] '}>
                              <DialogHeader>
                                <DialogTitle
                                  className={
                                    'font-medium border-b border-neutral-100 pb-[2rem]  text-[2.6rem] leading-[30px] text-black font-primary'
                                  }
                                >
                                  {t('remove_invitation')}
                                </DialogTitle>
                                <DialogDescription className={'sr-only'}>
                                  <span>Remove member</span>
                                </DialogDescription>
                              </DialogHeader>
                              <RemoveInvitationDialogContent email={member.email}/>
                            </DialogContent>
                          </Dialog>
                        </li>
                      </ul>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}
