"use client";
import PageLoader from "@/components/Loaders/PageLoader";
import { Event, User } from "@workspace/typescript-config";
import { ButtonPrimary } from "@workspace/ui/components/buttons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/Inputs";
import LoadingCircleSmall from "@workspace/ui/components/LoadingCircleSmall";
import { Scanner } from "iconsax-react";
import { useTranslations } from "next-intl";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

export default function CheckingDialog({
  event,
  user,
}: {
  event: Event;
  user: User;
}) {
  const t = useTranslations("Events.single_event");
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketID, setTicketID] = useState("");
  const [ticketIdError, setTicketIdError] = useState("");
  async function CheckTicketID() {
    setIsLoading(true);
    if (ticketID.trim()) {
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checking/event/${event.eventId}/ticket-id/${ticketID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      const response = await request.json();
      if (response.status === "success") {
        toast.success("success");
        setTicketID("");
      } else {
        toast.error(response.message);
      }
    } else {
      setTicketIdError("Enter TicketID");
    }
    setIsLoading(false);
  }
  return (
    <>
      <PageLoader isLoading={isLoading} />
      <Dialog>
        <DialogTrigger>
          <span className="px-[15px] py-[7.5px] border-2 border-transparent rounded-[100px] text-center font-medium text-[1.5rem] h-auto leading-[20px] cursor-pointer transition-all duration-400 flex items-center justify-center gap-4 bg-neutral-100 text-neutral-700">
            <Scanner variant={"Bulk"} color={"#737C8A"} size={20} />
            {t("check_in")}
          </span>
        </DialogTrigger>
        <DialogContent className={"w-[360px] lg:w-[520px] "}>
          <DialogHeader>
            <DialogTitle
              className={
                "font-medium border-b border-neutral-100 pb-[2rem]  text-[2.6rem] leading-[30px] text-black font-primary"
              }
            >
              {t("check_in")}
            </DialogTitle>
            <DialogDescription className={"sr-only"}>
              <span>Share event</span>
            </DialogDescription>
          </DialogHeader>
          <div
            className={
              "flex flex-col w-auto justify-center items-center gap-[30px]"
            }
          >
            <p
              className={
                "font-sans text-[1.8rem] leading-[25px] text-[#cdcdcd] text-center w-[320px] lg:w-full"
              }
            >
              {t("check_in_description")}
            </p>
            <div className="w-full">
              <Input
                value={ticketID}
                onChange={(e) => setTicketID(e.target.value)}
                error={ticketIdError}
              >
                {t("ticketID")}
              </Input>
            </div>
          </div>
          <DialogFooter>
            <ButtonPrimary
              onClick={CheckTicketID}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <LoadingCircleSmall /> : t("check_in")}
            </ButtonPrimary>
            <DialogClose ref={closeRef} className="sr-only"></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
