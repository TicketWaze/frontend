import Image from 'next/image';
import React from 'react'
import ticketBG from './ticket-bg.svg'
import { useTranslations } from 'next-intl';
import Ticket from '@/types/Ticket';
import Capitalize from '@workspace/ui/lib/Capitalize';
import Event from '@/types/Event';
import FormatDate from '@/lib/FormatDate';

export default function UpcomingTicket({ ticket, event }: { ticket: Ticket; event: Event }) {
    const t = useTranslations('Event')
    const isFree = event.eventTicketTypes[0].ticketTypePrice == 0
    return (
        <div className='lg:overflow-y-auto min-h-0 flex flex-col gap-20 p-4 pt-0 '>
            <div className=' flex flex-col gap-8 h-[500px] bg-[rgba(0,0,0,0.05)] w-full lg:h-[681px] relative shadow-[0_15px_25px_0_rgba(0,0,0,0.05)]'>
                <Image src={ticketBG} alt={'ticket bg'} className='h-full' />
                <div
                    className={
                        'absolute top-0 w-full px-4 left-[50%] -translate-x-[50%] flex flex-col items-center gap-8'
                    }
                >
                    <span className={'font-primary font-medium pt-4 text-[2.2rem] leading-[30px] text-black'}>
                        {t('ticket')}
                    </span>
                    <div
                        className={
                            'w-full h-[250px] lg:h-[296px]  bg-neutral-100 p-[15px] text-center font-mono text-[1.4rem] flex flex-col justify-between items-center '
                        }
                    >
                        <div className={'flex items-center justify-between gap-4 w-full'}>
                            <span className='text-neutral-600'>1x {Capitalize(ticket.ticketType)}</span>
                            {isFree ? <span className='text-deep-100 font-medium'>{t('free')}</span> : null}
                        </div>
                        <div className='flex flex-col gap-4 w-full'>
                            <div className='h-[2px] w-full rounded-[10px] bg-neutral-200'></div>
                            <div className={'flex items-center justify-between gap-4 w-full'}>
                                <span className='text-neutral-600'>{t('ticketId')}</span>
                                <span className='text-primary-500 font-medium'>{ticket.ticketName}</span>
                            </div>
                            <div className='h-[2px] w-full rounded-[10px] bg-neutral-200'></div>
                            <div className={'flex items-center justify-between gap-4 w-full'}>
                                <span className='text-neutral-600'>{t('date')}</span>
                                <span className='text-deep-100 font-medium'>{FormatDate(event.eventDays[0].startDate)}</span>
                            </div>
                            <div className={'flex items-center justify-between gap-4 w-full'}>
                                <span className='text-neutral-600'>{t('time')}</span>
                                <span className='text-deep-100 font-medium'>{event.eventDays[0].startTime}</span>
                            </div>
                            <div className={'flex items-center justify-between gap-4 w-full'}>
                                <span className='text-neutral-600'>{t('location')}</span>
                                <span className='text-deep-100 font-medium text-right'>{event.address}</span>
                            </div>
                        </div>

                    </div>
                </div>
                <div
                    className={
                        'absolute bottom-[7%] h-[83px] left-[50%] -translate-x-[50%] flex flex-col gap-8'
                    }
                >

                    <div className={'flex flex-col gap-4 justify-center flex-wrap'}>
                        <span
                            className={
                                'text-primary-500 text-[1.4rem] leading-[20px] px-[15px] py-[5px] bg-primary-50 rounded-[20px]'
                            }
                        >
                            {Capitalize(ticket.ticketType)}
                        </span>
                        {isFree ? <span className={'font-primary text-center font-medium text-[28px] leading-[32px] text-[#000]'}>
                            {t('free')}
                        </span> : null}
                    </div>
                </div>
            </div>
        </div>
    )
}
