"use client";
import TimesTampToDateTime from "@/lib/TimesTampToDateTime";
import Event from "@/types/Event";
import { ButtonPrimary } from "@workspace/ui/components/buttons";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
} from "@workspace/ui/components/drawer";
import { Calendar2, Clock, Edit2, Location } from "iconsax-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

export default function EventDrawerContent({ event }: { event: Event }) {
  const t = useTranslations("Events.single_event");
  const startDate = new Date(event.eventDays?.[0]?.startDate ?? "");
  // const [edit, setEdit] = useState(false);
  return (
    <DrawerContent className={"my-6 p-[30px] rounded-[30px]  lg:w-[580px]"}>
      <div className={"w-full flex flex-col items-center overflow-y-scroll"}>
        <DrawerTitle className={"pb-[40px]"}>
          <span
            className={
              "font-primary font-medium text-center text-[2.6rem] leading-[30px] text-black"
            }
          >
            {t("event_details")}
          </span>
        </DrawerTitle>
        <DrawerDescription className="sr-only">Event details</DrawerDescription>
        <div className={"w-full"}>
          <div className={"w-full gap-[30px] flex flex-col"}>
            <div className={"w-full flex flex-col gap-[1.5rem] justify-start"}>
              {/* <span
                className={
                  "font-primary text-deep-100 font-medium text-[1.8rem]"
                }
              >
                {t("thumbnail")}
              </span> */}
              <Image
                alt={event.eventName}
                src={event.eventImageUrl}
                height={298}
                width={520}
                className={"rounded-[10px] h-[298px] object-cover object-top"}
              />
            </div>
            <div className={"w-full flex flex-col gap-[1.5rem] justify-start"}>
              <div className="flex items-center justify-between">
                <span
                  className={
                    "font-primary text-deep-100 font-medium text-[1.8rem]"
                  }
                >
                  {t("about")}
                </span>
                {/* <button className="w-[35px] cursor-pointer h-[35px] rounded-full bg-neutral-200 flex items-center justify-center">
                  <Edit2 variant={"Bulk"} color={"#737C8A"} size={20} />
                </button> */}
                {/* <Dialog>
                  <DialogTrigger asChild>
                    <button className='w-[35px] h-[35px] rounded-full bg-neutral-200 flex items-center justify-center'>
                      <Edit2 variant={'Bulk'} color={'#737C8A'} size={20} />
                    </button>
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
                    </div>
                  </DialogContent>
                </Dialog> */}
              </div>
              <p className={"text-[1.5rem] text-neutral-700"}>
                {event.eventDescription}
              </p>
            </div>
            <div className={"w-full flex flex-col gap-[1.5rem] justify-start"}>
              <span
                className={
                  "font-primary text-deep-100 font-medium text-[1.8rem]"
                }
              >
                {t("event_details")}
              </span>
              <div className={"flex items-center gap-[5px]"}>
                <div
                  className={
                    "w-[35px] h-[35px] flex items-center justify-center bg-neutral-100 rounded-full"
                  }
                >
                  <Calendar2 size="20" color="#737c8a" variant="Bulk" />
                </div>
                <span
                  className={
                    "font-normal text-[1.4rem] leading-8 text-deep-200"
                  }
                >
                  {startDate.toDateString()}
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
                  className={
                    "font-normal text-[1.4rem] leading-8 text-deep-200"
                  }
                >
                  {`${TimesTampToDateTime(event.eventDays[0]?.startDate ?? "").hour}:${TimesTampToDateTime(event.eventDays[0]?.startDate ?? "").minute}`}{" "}
                  -{" "}
                  {`${TimesTampToDateTime(event.eventDays[0]?.endTime ?? "").hour}:${TimesTampToDateTime(event.eventDays[0]?.endTime ?? "").minute}`}
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
                  {event.address}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DrawerFooter className="lg:flex-row">
        {/* <ButtonPrimary onClick={() => setEdit(true)} className="flex-1 gap-4">
          <Edit2 variant={"Bulk"} color={"#ffffff"} size={20} /> Edit
        </ButtonPrimary> */}
        <DrawerClose className={" cursor-pointer w-full flex-1"}>
          <div
            className={
              "border-primary-500 text-primary-500 bg-primary-100 px-[3rem] py-[15px] border-2  rounded-[100px] text-center font-medium text-[1.5rem] h-auto leading-[20px] cursor-pointer transition-all duration-400 flex items-center justify-center "
            }
          >
            {t("close")}
          </div>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  );
}
