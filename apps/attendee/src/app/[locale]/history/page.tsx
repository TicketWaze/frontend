import AttendeeLayout from "@/components/Layouts/AttendeeLayout";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { Clock } from "iconsax-react";
import { getLocale, getTranslations } from "next-intl/server";
import React from "react";

export default async function HistoryPage() {
  const locale = await getLocale();
  const session = await auth();
  if (!session) {
    redirect({ href: "/auth/login", locale });
  }
  const t = await getTranslations("History");
  return (
    <AttendeeLayout title="HistoryPage">
      <>
        <header className="w-full flex items-center justify-between">
          {/* {!mobileSearch && ( */}
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
          {/* )} */}
          {/* <div
            className={`flex items-center gap-4 ${mobileSearch && "w-full"}`}
          >
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
          </div> */}
        </header>
        {/* <ul className="list pt-4">
          {filteredEvents.map((event: any) => {
            const today = DateTime.now();
            const eventStart = event.eventDays?.[0]?.startDate
              ? DateTime.fromISO(event.eventDays[0].startDate)
              : null;
            const daysLeft = eventStart
              ? eventStart.diff(today, "days").days
              : null;
            const roundedDays = Math.ceil(
              daysLeft && daysLeft > 0 ? daysLeft : 0
            );
            const date = new Date(event.eventDays[0]?.startDate ?? "");
            const slug = Slugify(event.eventName);
            return (
              <li key={event.eventId}>
                <UpcomingCard
                  href={`upcoming/${slug}`}
                  image={event.eventImageUrl}
                  name={event.eventName}
                  day={roundedDays}
                  tickets={event.tickets.length}
                />
              </li>
            );
          })}
        </ul> */}
        {/* {filteredEvents.length === 0 && (
          <div className="flex flex-col h-full justify-center items-center gap-[30px]">
            <div className="h-[120px] w-[120px] bg-neutral-100 rounded-full flex items-center justify-center">
              <div className="w-[90px] h-[90px] bg-neutral-200 flex items-center justify-center rounded-full">
                <Star size="50" color="#0D0D0D" variant="Bulk" />
              </div>
            </div>
            <span className="font-primary text-[1.8rem] text-center leading-8 text-neutral-600">
              {t("noResult")} <span className="text-deep-100">{query}</span>
            </span>
          </div>
        )} */}
        {/* {events.length === 0 && ( */}
        <div
          className={
            "w-[330px] lg:w-[460px] mx-auto flex flex-col h-full justify-center items-center gap-[5rem]"
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
              <Clock size="50" color="#0d0d0d" variant="Bulk" />
            </div>
          </div>
          <div className={"flex flex-col gap-[3rem] items-center text-center"}>
            <p
              className={
                "text-[1.8rem] leading-[25px] text-neutral-600 max-w-[330px] lg:max-w-[422px]"
              }
            >
              {t("description")}
            </p>
          </div>
        </div>
        {/* )} */}
      </>
    </AttendeeLayout>
  );
}
