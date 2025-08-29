'use client'
import { LinkPrimary } from '@/components/Links'
import { Link } from '@/i18n/navigation'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerTitle, DrawerTrigger } from '@workspace/ui/components/drawer'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table'
import { ArrowRight2, Money3, SearchNormal } from 'iconsax-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React from 'react'
import Ticket from '@/types/Ticket'
import Order from '@/types/Order'
import { ButtonAccent, ButtonPrimary } from '@workspace/ui/components/buttons'



export default function FinancePageContent({ transactions }: { transactions: { tickets: Ticket[], orders: Order[] } }) {
  const t = useTranslations('Finance')
  const { data: session } = useSession()
  const currentOrganisation = session?.activeOrganisation
  const { orders, tickets } = transactions
  return (
    <div className={'flex flex-col gap-[3rem] overflow-y-scroll'}>
      <div
        className={
          'grid grid-cols-2 lg:grid-cols-3 divide-x divide-neutral-100 border-neutral-100 border-b'
        }
      >
        <div className={'pb-[30px]'}>
          <span className={'text-[14px] text-neutral-600 leading-[20px] pb-[5px]'}>
            {t('amounts.revenue')}
          </span>
          <p className={'font-medium text-[1.6rem] lg:text-[25px] leading-[30px] font-primary'}>
            {'N/A'}{' '}
            <span className={'font-normal text-[1.6rem] lg:text-[20px] text-neutral-500'}>
              HTG
            </span>
          </p>
        </div>
        {/*<div className={'pl-[25px]'}>*/}
        {/*  <span className={'text-[14px] text-neutral-600 leading-[20px] pb-[5px]'}>*/}
        {/*    {finance.amounts.profit}*/}
        {/*  </span>*/}
        {/*  <p className={'font-medium text-[1.6rem] lg:text-[25px] leading-[30px] font-primary'}>*/}
        {/*    193,570,219{' '}*/}
        {/*    <span className={'font-normal text-[1.6rem] lg:text-[20px] text-neutral-500'}>HTG</span>*/}
        {/*  </p>*/}
        {/*</div>*/}
        <div className={'pl-0 lg:pl-[25px]'}>
          <span className={'text-[14px] text-neutral-600 leading-[20px] pb-[5px]'}>
            {t('amounts.balance')}
          </span>
          <p className={'font-medium text-[1.6rem] lg:text-[25px] leading-[30px] font-primary'}>
            {currentOrganisation?.balance}
            <span className={'font-normal text-[1.6rem] lg:text-[20px] text-neutral-500'}>
              {' '}
              HTG
            </span>
          </p>
        </div>
      </div>
      {/* {isAdmin && ( */}
      {/* <LinkPrimary className={'lg:hidden py-[7.5px]'} href={'/finance/initiate-withdrawal'}>
        {t('withdraw_btn')}
      </LinkPrimary> */}
      {/* )} */}
      <div className={'flex flex-col gap-8'}>
        <div
          className={
            'flex flex-col gap-8 lg:gap-0 lg:flex-row w-full items-center justify-between'
          }
        >
          <span
            className={'font-primary  w-full font-medium text-[18px] leading-[25px] text-black'}
          >
            {t('transactions.title')}
          </span>
          <div
            className={
              'bg-neutral-100 rounded-[30px] flex items-center gap-2 w-full lg:w-auto lg:min-w-[243px] px-[1.5rem] py-4'
            }
          >
            <input
              placeholder={t('search')}
              className={
                'text-black font-normal text-[1.4rem] leading-[20px] w-full outline-none'
              }
            />
            <SearchNormal size="20" color="#737c8a" variant="Bulk" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className={
                  'font-bold text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                }
              >
                {t('transactions.table.id')}
              </TableHead>
              <TableHead
                className={
                  'font-bold text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                }
              >
                {t('transactions.table.name')}
              </TableHead>
              <TableHead
                className={
                  'font-bold hidden lg:table-cell text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                }
              >
                {t('transactions.table.class')}
              </TableHead>
              <TableHead
                className={
                  'font-bold hidden lg:table-cell text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                }
              >
                {t('transactions.table.amount')}
              </TableHead>
              <TableHead
                className={
                  'font-bold hidden lg:table-cell text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                }
              >
                {t('transactions.table.status')}
              </TableHead>
              <TableHead
                className={
                  'font-bold hidden lg:table-cell text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                }
              >
                {t('transactions.table.date')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map(
              ({ ticketId, ticketName, ticketType, ticketPrice, orderId, createdAt }) => {
                const [order] = orders.filter((order) => orderId === order.orderId)
                return (
                  <TableRow key={ticketId}>
                    <TableCell className={'text-[1.5rem] py-[15px] leading-8 text-neutral-900'}>
                      <Drawer direction={'right'}>
                        <DrawerTrigger>
                          <span className={'cursor-pointer'}>{ticketName}</span>
                        </DrawerTrigger>
                        <Informations />
                      </Drawer>
                    </TableCell>
                    <TableCell className={'text-[1.5rem] leading-8 text-neutral-900'}>
                      <Drawer direction={'right'}>
                        <DrawerTrigger>
                          <span className={'cursor-pointer'}>EventName</span>
                        </DrawerTrigger>
                        <Informations />
                      </Drawer>
                    </TableCell>
                    <TableCell className={'hidden lg:table-cell'}>
                      {ticketType === 'general' && (
                        <span
                          className={
                            'py-[3px] text-[1.1rem] font-bold leading-[15px] text-center uppercase text-[#EF1870]  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                          }
                        >
                          general
                        </span>
                      )}
                      {ticketType === 'vip' && (
                        <span
                          className={
                            'py-[3px] text-[1.1rem] font-bold leading-[15px] text-center uppercase text-[#7A19C7]  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                          }
                        >
                          vip
                        </span>
                      )}
                      {ticketType === 'vvip' && (
                        <span
                          className={
                            'py-[3px] text-[1.1rem] font-bold leading-[15px] text-center uppercase text-deep-100  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                          }
                        >
                          Premium vip
                        </span>
                      )}
                    </TableCell>
                    <TableCell
                      className={
                        'text-[1.5rem] hidden lg:table-cell font-medium leading-8 text-neutral-900'
                      }
                    >
                      {ticketPrice} HTG
                    </TableCell>
                    <TableCell className={'hidden lg:table-cell'}>
                      {order?.status === 'SUCCESSFUL' && (
                        <span
                          className={
                            'py-[3px] text-[1.1rem] font-bold leading-[15px] text-center uppercase text-[#349C2E]  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                          }
                        >
                          {t('filters.successful')}
                        </span>
                      )}
                      {order?.status === 'PENDING' && (
                        <span
                          className={
                            'py-[3px] text-[1.1rem] font-bold leading-[15px] text-center uppercase text-[#EA961C]  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                          }
                        >
                          {t('filters.pending')}
                        </span>
                      )}
                    </TableCell>
                    <TableCell
                      className={'text-[1.5rem] hidden lg:table-cell leading-8 text-neutral-900'}
                    >
                      {createdAt.toLocaleString()}
                    </TableCell>
                  </TableRow>
                )
              }
            )}
          </TableBody>
        </Table>
        {tickets.length === 0 && (
          <div className={'w-[330px] lg:w-[460px] mx-auto flex flex-col items-center gap-[5rem]'}>
            <div
              className={
                'w-[120px] h-[120px] rounded-full flex items-center justify-center bg-neutral-100'
              }
            >
              <div
                className={
                  'w-[90px] h-[90px] rounded-full flex items-center justify-center bg-neutral-200'
                }
              >
                <Money3 size="50" color="#0d0d0d" variant="Bulk" />
              </div>
            </div>
            <div className={'flex flex-col gap-[3rem] items-center text-center'}>
              <p
                className={
                  'text-[1.8rem] leading-[25px] text-neutral-600 max-w-[330px] lg:max-w-[422px]'
                }
              >
                {t('transactions.description')}
              </p>
            </div>
          </div>
        )}
        {tickets.length > 0 && (
          <div className={'w-full flex justify-end'}>
            <Link
              href={'/finance/transactions'}
              className={
                'text-primary-500 justify-end flex gap-4 items-center text-[1.5rem] leading-[20px]'
              }
            >
              {t('transactions.more')}
              <ArrowRight2 size="20" color="#E45B00" variant="Bulk" />
            </Link>
          </div>
        )}
        <div></div>
      </div>
      <div className={'flex flex-col gap-8'}>
        <div className={'flex items-center justify-between'}>
          <span className={'font-primary font-medium text-[18px] leading-[25px] text-black'}>
            {t('withdrawal.title')}
          </span>
          <div className={'flex items-center gap-4'}>
            <div
              className={
                'bg-neutral-100 rounded-[30px] flex items-center gap-2 w-full lg:w-auto lg:min-w-[243px] px-[1.5rem] py-4'
              }
            >
              <input
                placeholder={t('search')}
                className={
                  'text-black font-normal text-[1.4rem] leading-[20px] w-full outline-none'
                }
              />
              <SearchNormal size="20" color="#737c8a" variant="Bulk" />
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className={
                  'font-bold text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                }
              >
                {t('withdrawal.table.id')}
              </TableHead>
              <TableHead
                className={
                  'font-bold text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                }
              >
                {t('withdrawal.table.name')}
              </TableHead>
              <TableHead
                className={
                  'font-bold hidden lg:table-cell text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                }
              >
                {t('withdrawal.table.account')}
              </TableHead>
              <TableHead
                className={
                  'font-bold hidden lg:table-cell text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                }
              >
                {t('withdrawal.table.amount')}
              </TableHead>
              <TableHead
                className={
                  'font-bold hidden lg:table-cell text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                }
              >
                {t('withdrawal.table.status')}
              </TableHead>
              <TableHead
                className={
                  'font-bold hidden lg:table-cell text-[1.1rem] pb-[15px] leading-[15px] text-deep-100 uppercase'
                }
              >
                {t('withdrawal.table.date')}
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        <div className={'w-[330px] lg:w-[460px] mx-auto flex flex-col items-center gap-[5rem]'}>
          <div
            className={
              'w-[120px] h-[120px] rounded-full flex items-center justify-center bg-neutral-100'
            }
          >
            <div
              className={
                'w-[90px] h-[90px] rounded-full flex items-center justify-center bg-neutral-200'
              }
            >
              <Money3 size="50" color="#0d0d0d" variant="Bulk" />
            </div>
          </div>
          <div className={'flex flex-col gap-[3rem] items-center text-center'}>
            <p
              className={
                'text-[1.8rem] leading-[25px] text-neutral-600 max-w-[330px] lg:max-w-[422px]'
              }
            >
              {t('withdrawal.description')}
            </p>
          </div>
        </div>
        {/*<Link*/}
        {/*  href={'#'}*/}
        {/*  className={*/}
        {/*    'text-primary-500 justify-end flex gap-4 items-center text-[1.5rem] leading-[20px]'*/}
        {/*  }*/}
        {/*>*/}
        {/*  {finance.transactions.more}*/}
        {/*  <ArrowRight2 size="20" color="#E45B00" variant="Bulk" />*/}
        {/*</Link>*/}
        <div></div>
      </div>
    </div>
  )
}

function Informations() {
  const t = useTranslations('Finance')
  return (
    <DrawerContent className={'my-6 p-[30px] rounded-[30px]'}>
      <div className={'w-full flex flex-col items-center overflow-y-scroll'}>
        <DrawerTitle className={'pb-[40px]'}>
          <span
            className={
              'font-primary font-medium text-center text-[2.6rem] leading-[30px] text-black'
            }
          >
            Transaction Details
          </span>
        </DrawerTitle>
        <DrawerDescription>
          <div className={'w-full flex flex-col gap-8'}>
            <p
              className={
                'flex justify-between items-center text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('transactions.details.name')}{' '}
              <span className={'text-deep-100 font-medium leading-[20px]'}>Jean Baptiste</span>
            </p>
            <p
              className={
                'flex justify-between items-center text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('transactions.details.email')}{' '}
              <span className={'text-deep-100 font-medium leading-[20px]'}>
                jean.baptiste@email.com
              </span>
            </p>
          </div>
          <Separator />
          <div className={'w-full flex flex-col gap-8'}>
            <p
              className={
                'flex justify-between items-center text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('transactions.details.event_name')}{' '}
              <span className={'text-deep-100 font-medium leading-[20px]'}>
                Cap-Haïtien Jazz Festival
              </span>
            </p>
            <p
              className={
                'flex justify-between items-center text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('transactions.details.date')}{' '}
              <span className={'text-deep-100 font-medium leading-[20px]'}>11 August 2024</span>
            </p>
            <p
              className={
                'flex justify-between items-center text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('transactions.details.time')}{' '}
              <span className={'text-deep-100 font-medium leading-[20px]'}>
                11:00 AM - 17:00 PM
              </span>
            </p>
            <p
              className={
                'flex justify-between items-start text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('transactions.details.location')}{' '}
              <span className={'text-deep-100 font-medium leading-[20px] max-w-[399px] text-right'}>
                Cap-Haïtien Cultural Center, Rue 20 Avenue, Cap-Haïtien, Haiti
              </span>
            </p>
          </div>
          <Separator />
          <div className={'w-full flex flex-col gap-8'}>
            <p
              className={
                'flex justify-between items-center text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('transactions.details.ticket_class')}{' '}
              <span className={'text-deep-100 font-medium leading-[20px]'}>
                1X{' '}
                <span className={'py-[3px] px-[5px] bg-[#f5f5f5] text-[#7A19C7] rounded-[30px]'}>
                  VIP
                </span>
              </span>
            </p>
            <p
              className={
                'flex justify-between items-center text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('transactions.details.price')}{' '}
              <span className={'text-deep-100 font-medium leading-[20px]'}>550 HTG</span>
            </p>
            <p
              className={
                'flex justify-between items-center text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('transactions.details.ticket_id')}{' '}
              <span className={'text-deep-100 font-medium leading-[20px]'}>#TICK1234567</span>
            </p>
            <p
              className={
                'flex justify-between items-start text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('transactions.details.total')}{' '}
              <span className={'text-deep-100 font-medium leading-[20px] max-w-[399px] text-right'}>
                550 HTG
              </span>
            </p>
          </div>
          <Separator />
          <div className={'w-full flex flex-col gap-8'}>
            <p
              className={
                'flex justify-between items-center text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('transactions.details.transaction_id')}{' '}
              <span className={'text-deep-100 font-medium leading-[20px]'}>Jean Baptiste</span>
            </p>
            <p
              className={
                'flex justify-between items-center text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('transactions.details.payment_method')}{' '}
              <span className={'text-deep-100 font-medium leading-[20px]'}>MonCash</span>
            </p>
            <p
              className={
                'flex justify-between items-center text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('transactions.details.payment_date')}{' '}
              <span className={'text-deep-100 font-medium leading-[20px]'}>
                11 July 2024, 12:21 PM
              </span>
            </p>
            <p
              className={
                'flex justify-between items-start text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('transactions.details.transaction_status')}{' '}
              <span className={'text-deep-100 font-medium leading-[20px] max-w-[399px] text-right'}>
                <span
                  className={
                    'py-[3px] text-[1.1rem] font-bold leading-[15px] text-center uppercase text-[#349C2E]  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                  }
                >
                  {t('filters.successful')}
                </span>
              </span>
            </p>
          </div>
          <Separator />
          <div className={'w-full flex flex-col gap-8'}>
            <p
              className={
                'flex justify-between items-center text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('transactions.details.check_status')}{' '}
              <span className={'text-deep-100 font-medium leading-[20px]'}>
                <span
                  className={
                    'py-[3px] text-[1.1rem] font-bold leading-[15px] text-center uppercase text-[#349C2E]  px-[5px] rounded-[30px] bg-[#f5f5f5]'
                  }
                >
                  checked-in
                </span>
              </span>
            </p>
            <p
              className={
                'flex justify-between items-center text-[1.4rem] leading-[20px] text-neutral-600'
              }
            >
              {t('transactions.details.check_time')}{' '}
              <span className={'text-deep-100 font-medium leading-[20px]'}>
                11 August 2024, 12:30 PM
              </span>
            </p>
            <div></div>
          </div>
        </DrawerDescription>
      </div>

      <DrawerFooter>
        <div className={'flex gap-8'}>
          <DrawerClose className={'flex-1 cursor-pointer'}>
            <ButtonAccent className={'w-full'}>{t('transactions.details.close')}</ButtonAccent>
          </DrawerClose>
          <ButtonPrimary className={'flex-1'}>{t('transactions.details.resend')}</ButtonPrimary>
        </div>
      </DrawerFooter>
    </DrawerContent>
  )
}

export function Separator() {
  return (
    <div className={'w-full py-[15px]'}>
      <div className={'bg-neutral-200 w-full h-[2px]'}></div>
    </div>
  )
}