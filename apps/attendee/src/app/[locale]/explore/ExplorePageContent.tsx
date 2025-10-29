"use client";
import EventCard from "@/components/EventCard";
import NoAuthDialog from "@/components/Layouts/NoAuthDialog";
import { Link } from "@/i18n/navigation";
import Slugify from "@/lib/Slugify";
import TimesTampToDateTime from "@/lib/TimesTampToDateTime";
import { Event } from "@workspace/typescript-config";
import { Dialog, DialogTrigger } from "@workspace/ui/components/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import {
  CloseCircle,
  Heart,
  Money3,
  SearchNormal,
  Ticket,
} from "iconsax-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

export default function ExplorePageContent({ events }: { events: Event[] }) {
  const t = useTranslations("Explore");
  const [query, setQuery] = useState("");
  const filteredEvents = events.filter((event) => {
    const search = query.toLowerCase();
    return event.eventName.toLowerCase().includes(search);
  });
  const { data: session } = useSession();

  const [mobileSearch, setMobileSearch] = useState(false);
  return (
    <>
      <header className="w-full flex items-center justify-between">
        {!mobileSearch && (
          <div className="flex flex-col gap-[5px]">
            {session?.user && (
              <span className="text-[1.6rem] leading-8 text-neutral-600">
                {t("subtitle")}{" "}
                <span className="text-deep-100">{session?.user.firstName}</span>
              </span>
            )}
            <span className="font-primary font-medium text-[1.8rem] lg:text-[2.6rem] leading-[2.5rem] lg:leading-12 text-black">
              {t("title")}
            </span>
          </div>
        )}
        <div className={`flex items-center gap-4 ${mobileSearch && "w-full"}`}>
          {mobileSearch && (
            <div
              className={
                "bg-neutral-100 w-full rounded-[30px] flex items-center justify-between lg:hidden px-[1.5rem] py-4"
              }
            >
              <input
                placeholder={t("search")}
                className={
                  "text-black font-normal text-[1.4rem] leading-[20px] w-full outline-none"
                }
                autoFocus
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                onClick={() => {
                  setMobileSearch(!mobileSearch);
                  setQuery("");
                }}
              >
                <CloseCircle size="20" color="#737c8a" variant="Bulk" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-4">
            <div
              className={
                "hidden bg-neutral-100 rounded-[30px] lg:flex items-center justify-between w-[243px] px-[1.5rem] py-4"
              }
            >
              <input
                placeholder={t("search")}
                className={
                  "text-black font-normal text-[1.4rem] leading-[20px] w-full outline-none"
                }
                onChange={(e) => setQuery(e.target.value)}
              />
              <SearchNormal size="20" color="#737c8a" variant="Bulk" />
            </div>
            <div className="w-[1px] h-[18px] bg-neutral-100"></div>
            {!mobileSearch && (
              <button
                onClick={() => setMobileSearch(!mobileSearch)}
                className={
                  "w-[35px] h-[35px] bg-neutral-100 rounded-full flex lg:hidden items-center justify-center"
                }
              >
                <SearchNormal size="20" color="#737c8a" variant="Bulk" />
              </button>
            )}
            {session?.user ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={"/explore/liked"}
                    className="w-[35px] h-[35px] flex items-center justify-center bg-neutral-100 rounded-full"
                  >
                    <Heart size={20} color="#737C8A" variant="Bulk" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-[1.2rem]">{t("liked")}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Dialog>
                <DialogTrigger>
                  <div className="w-[35px] h-[35px] cursor-pointer flex items-center justify-center bg-neutral-100 rounded-full">
                    <Heart size={20} color="#737C8A" variant="Bulk" />
                  </div>
                </DialogTrigger>
                <NoAuthDialog />
              </Dialog>
            )}
          </div>
        </div>
      </header>
      {events.length > 0 ? (
        <>
          <ul className="list pt-4">
            {filteredEvents.map((event) => {
              const date = TimesTampToDateTime(
                event.eventDays[0]?.startDate ?? ""
              );
              const slug = Slugify(event.eventName);
              return (
                <li key={event.eventId}>
                  <EventCard
                    href={`/explore/${slug}`}
                    image={event.eventImageUrl}
                    name={event.eventName}
                    date={date}
                    country={event.country ?? ""}
                    city={event.city ?? ""}
                    price={
                      event.currency === "USD"
                        ? (event.eventTicketTypes[0]?.usdPrice ?? 0)
                        : (event.eventTicketTypes[0]?.ticketTypePrice ?? 0)
                    }
                    currency={event.currency}
                    tags={event.eventTags}
                    eventType={event.eventType}
                  />
                </li>
              );
            })}
          </ul>
          {filteredEvents.length === 0 && (
            <div className="flex flex-col h-full justify-center items-center gap-[30px]">
              <div className="h-[120px] w-[120px] bg-neutral-100 rounded-full flex items-center justify-center">
                <div className="w-[90px] h-[90px] bg-neutral-200 flex items-center justify-center rounded-full">
                  <Ticket size="50" color="#0D0D0D" variant="Bulk" />
                </div>
              </div>
              <span className="font-primary text-[1.8rem] text-center leading-8 text-neutral-600">
                {t("noResult")} <span className="text-deep-100">{query}</span>
              </span>
            </div>
          )}
        </>
      ) : (
        <div
          className={
            "w-[330px] lg:w-[460px] mx-auto h-full justify-center flex flex-col items-center gap-[5rem]"
          }
        >
          <div
            className={
              "w-[120px] h-[120px] rounded-full flex items-center justify-center bg-neutral-100"
            }
          >
            <div
              className={
                "w-[90px] h-[90px] rounded-full flex items-center justify-center bg-neutral-200"
              }
            >
              <Money3 size="50" color="#0d0d0d" variant="Bulk" />
            </div>
          </div>
          <div className={"flex flex-col gap-[3rem] items-center text-center"}>
            <p
              className={
                "text-[1.8rem] leading-[25px] text-neutral-600 max-w-[330px] lg:max-w-[422px]"
              }
            >
              {t("noEvent")}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
