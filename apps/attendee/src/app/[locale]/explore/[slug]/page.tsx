import Event from '@/types/Event'
import Ticket from '@/types/Ticket'
import React from 'react'
import BackButton from "@workspace/ui/components/BackButton"
import AttendeeLayout from '@/components/Layouts/AttendeeLayout'
import Image from 'next/image'
import EventActions from './EventActions'
import { getTranslations } from 'next-intl/server'
import { Calendar2, Call, Clock, Global, Location, Sms, Ticket2 } from 'iconsax-react'
import { ButtonBlack } from '@workspace/ui/components/buttons'
import FormatDate from '@/lib/FormatDate'
import Capitalize from "@workspace/ui/lib/Capitalize"
import VerifiedOrganisationCheckMark from '@/components/VerifiedOrganisationCheckMark'
import Follow from './Follow'
import { auth } from '@/lib/auth'
import User from '@/types/User'
import Unfollow from './Unfollow'
import Map from './MapComponent'
import { Link } from '@/i18n/navigation'

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await auth()
  const eventRequest = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${slug}`)
  const eventResponse = await eventRequest.json()
  const event: Event = eventResponse.event
  const tickets: Ticket[] = eventResponse.tickets
  const organisation = eventResponse.organisation

  const favoriteRequest = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${event.eventId}/favorite`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${session?.user.accessToken}`,
      'Content-Type': 'application/json',
    }
  })
  const favoriteResponse = await favoriteRequest.json()


  const isFollowing = organisation.followers.filter((follower: any) => follower.userId === session?.user.userId)


  const t = await getTranslations('Event')

  return (
    <AttendeeLayout title={event.eventName}>
      <div className="flex flex-col gap-8 h-full min-h-0">
        <BackButton text={t('back')} />
        <span className='font-primary font-medium text-[2.6rem] leading-12 text-black mb-4'>
          {event.eventName}
        </span>
        <main className="w-full gap-8 flex flex-col lg:grid lg:grid-cols-[29fr_23fr] lg:min-h-0 overflow-y-auto h-full">
          <div className="flex flex-col gap-8 overflow-y-auto min-h-0">
            <div className="w-full max-h-[298px] overflow-hidden rounded-[10px] flex-shrink-0">
              <Image
                src={event.eventImageUrl}
                width={580}
                height={298}
                alt={event.eventName}
                className="w-full"
              />
            </div>
            <EventActions event={event} user={session?.user as User} isFavorite={favoriteResponse.isFavorite} />
            <Separator />
            <div className='flex flex-col gap-4'>
              <span className='font-semibold text-[1.6rem] leading-8 text-deep-100'>{t('about')}</span>
              <p className='text-[1.5rem] leading-12 text-neutral-700'>{event.eventDescription}</p>
            </div>
            <Separator />
            <div>
              <span className='font-semibold text-[1.6rem] leading-8 text-deep-100'>{t('contact')}</span>
            </div>
            <div className={"flex flex-col gap-[5px]"}>
              <div className={"flex items-center gap-4"}>
                <Sms size="20" color="#737c8a" variant="Bulk" />
                <span
                  className={
                    "font-normal text-[1.5rem] leading-[30px] text-neutral-700"
                  }
                >
                  {organisation.organisationEmail}
                </span>
              </div>
              <div className={"flex items-center gap-4"}>
                <Call size="20" color="#737c8a" variant="Bulk" />
                <span
                  className={
                    "font-normal text-[1.5rem] leading-[30px] text-neutral-700"
                  }
                >
                  {organisation.organisationPhoneNumber}
                </span>
              </div>
              {organisation.organisationWebsite && <div className={"flex items-center gap-4"}>
                <Global size="20" color="#737c8a" variant="Bulk" />
                <span
                  className={
                    "font-normal text-[1.5rem] leading-[30px] text-neutral-700"
                  }
                >
                  {organisation.organisationWebsite}
                </span>
              </div>}
            </div>
            <Separator />
            <div className="lg:hidden flex flex-col gap-8">
              <div className={"flex flex-col gap-8"}>
                <span
                  className={"font-semibold text-[1.6rem] leading-8 text-deep-200"}
                >
                  {t("details")}
                </span>
                {/*  organizer*/}
                <div className={"flex items-center justify-between w-full"}>
                  <div className={"flex items-center gap-4"}>
                    {organisation?.profileImageUrl ? <Image src={organisation.profileImageUrl} width={35} height={35} alt={organisation.organisationName} className="rounded-full" /> : <span
                      className="w-[35px] h-[35px] flex items-center justify-center bg-black rounded-full text-white uppercase font-medium text-[2.2rem] leading-[30px] font-primary"
                    >
                      {organisation?.organisationName.slice()[0]?.toUpperCase()}
                    </span>}
                    <div className={"flex flex-col"}>
                      <span
                        className={
                          "font-normal text-[1.4rem] leading-8 text-deep-200"
                        }
                      >
                        {organisation.organisationName} {organisation.isVerified && <VerifiedOrganisationCheckMark />}
                      </span>
                      <span
                        className={
                          "font-normal text-[1.3rem] leading-8 text-neutral-600"
                        }
                      >
                        {organisation.followers.length} {t("followers")}
                      </span>
                    </div>
                  </div>
                  {isFollowing.length > 0 ? <Unfollow user={session?.user as User} organisationId={event.organisationId} /> : <Follow user={session?.user as User} organisationId={event.organisationId} />}


                </div>
                {/*  date*/}
                <div className={"flex items-center gap-[5px]"}>
                  <div
                    className={
                      "w-[35px] h-[35px] flex items-center justify-center bg-neutral-100 rounded-full"
                    }
                  >
                    <Calendar2 size="20" color="#737c8a" variant="Bulk" />
                  </div>
                  <span
                    className={"font-normal text-[1.4rem] leading-8 text-deep-200"}
                  >
                    {FormatDate(event.eventDays[0].startDate)}
                  </span>
                </div>
                {/*  time*/}
                <div className={"flex items-center gap-[5px]"}>
                  <div
                    className={
                      "w-[35px] h-[35px] flex items-center justify-center bg-neutral-100 rounded-full"
                    }
                  >
                    <Clock size="20" color="#737c8a" variant="Bulk" />
                  </div>
                  <span
                    className={"font-normal text-[1.4rem] leading-8 text-deep-200"}
                  >
                    {event.eventDays[0].startTime} - {event.eventDays[0].endTime}
                  </span>
                </div>
                {/*  address*/}
                <div className={"flex items-center gap-[5px] "}>
                  <div
                    className={
                      "w-[35px] h-[35px] flex items-center justify-center bg-neutral-100 rounded-full"
                    }
                  >
                    <Location size="20" color="#737c8a" variant="Bulk" />
                  </div>
                  <span
                    className={
                      "font-normal text-[1.4rem] leading-8 text-deep-200 max-w-[293px]"
                    }
                  >
                    {event.address}, {event.city}, {Capitalize(event.state)}, {event.country}
                  </span>
                </div>
                {/*  sold*/}
                {/* <div className={"flex items-center gap-[5px] "}>
              <div
                className={
                  "w-[35px] h-[35px] flex items-center justify-center bg-neutral-100 rounded-full"
                }
              >
                <Ticket2 size="20" color="#737c8a" variant="Bulk" />
              </div>
              <span
                className={
                  "font-normal text-[1.4rem] leading-8 text-deep-200 max-w-[293px]"
                }
              >
                500+ {t("sold")}
              </span>
            </div> */}
              </div>
              <Separator />
              <div className=' flex flex-col gap-8'>
                <span
                  className={"font-semibold text-[1.6rem] leading-8 text-deep-200"}
                >
                  {t("direction")}
                </span>
                <Map event={event} />
                <div></div>
              </div>
            </div>
            <div></div>
          </div>

          <div className="hidden lg:flex lg:flex-col lg:overflow-y-auto min-h-0 flex-col gap-8 p-4 pt-0">
            <div className={"flex flex-col gap-8"}>
              <span
                className={"font-semibold text-[1.6rem] leading-8 text-deep-200"}
              >
                {t("details")}
              </span>
              {/*  organizer*/}
              <div className={"flex items-center justify-between w-full"}>
                <Link href={`/organizers/${organisation.organisationId}`} className={"flex items-center gap-4"}>
                  {organisation?.profileImageUrl ? <Image src={organisation.profileImageUrl} width={35} height={35} alt={organisation.organisationName} className="rounded-full" /> : <span
                    className="w-[35px] h-[35px] flex items-center justify-center bg-black rounded-full text-white uppercase font-medium text-[2.2rem] leading-[30px] font-primary"
                  >
                    {organisation?.organisationName.slice()[0]?.toUpperCase()}
                  </span>}
                  <div className={"flex flex-col"}>
                    <span
                      className={
                        "font-normal text-[1.4rem] leading-8 text-deep-200"
                      }
                    >
                      {organisation.organisationName} {organisation.isVerified && <VerifiedOrganisationCheckMark />}
                    </span>
                    <span
                      className={
                        "font-normal text-[1.3rem] leading-8 text-neutral-600"
                      }
                    >
                      {organisation.followers.length} {t("followers")}
                    </span>
                  </div>
                </Link>
                {isFollowing.length > 0 ? <Unfollow user={session?.user as User} organisationId={event.organisationId} /> : <Follow user={session?.user as User} organisationId={event.organisationId} />}
              </div>
              {/*  date*/}
              <div className={"flex items-center gap-[5px]"}>
                <div
                  className={
                    "w-[35px] h-[35px] flex items-center justify-center bg-neutral-100 rounded-full"
                  }
                >
                  <Calendar2 size="20" color="#737c8a" variant="Bulk" />
                </div>
                <span
                  className={"font-normal text-[1.4rem] leading-8 text-deep-200"}
                >
                  {FormatDate(event.eventDays[0].startDate)}
                </span>
              </div>
              {/*  time*/}
              <div className={"flex items-center gap-[5px]"}>
                <div
                  className={
                    "w-[35px] h-[35px] flex items-center justify-center bg-neutral-100 rounded-full"
                  }
                >
                  <Clock size="20" color="#737c8a" variant="Bulk" />
                </div>
                <span
                  className={"font-normal text-[1.4rem] leading-8 text-deep-200"}
                >
                  {event.eventDays[0].startTime} - {event.eventDays[0].endTime}
                </span>
              </div>
              {/*  address*/}
              <div className={"flex items-center gap-[5px] "}>
                <div
                  className={
                    "w-[35px] h-[35px] flex items-center justify-center bg-neutral-100 rounded-full"
                  }
                >
                  <Location size="20" color="#737c8a" variant="Bulk" />
                </div>
                <span
                  className={
                    "font-normal text-[1.4rem] leading-8 text-deep-200 max-w-[293px]"
                  }
                >
                  {event.address}, {event.city}, {Capitalize(event.state)}, {event.country}
                </span>
              </div>
              {/*  sold*/}
              {/* <div className={"flex items-center gap-[5px] "}>
              <div
                className={
                  "w-[35px] h-[35px] flex items-center justify-center bg-neutral-100 rounded-full"
                }
              >
                <Ticket2 size="20" color="#737c8a" variant="Bulk" />
              </div>
              <span
                className={
                  "font-normal text-[1.4rem] leading-8 text-deep-200 max-w-[293px]"
                }
              >
                500+ {t("sold")}
              </span>
            </div> */}
            </div>
            <Separator />
            <div className=' flex flex-col gap-8'>
              <span
                className={"font-semibold text-[1.6rem] leading-8 text-deep-200"}
              >
                {t("direction")}
              </span>
              <Map event={event} />
              <div></div>
            </div>
          </div>


        </main>
      </div>
    </AttendeeLayout>
  )
}

function Separator() {
  return <div className='bg-neutral-100 h-[2px] w-full flex-shrink-0'></div>
}