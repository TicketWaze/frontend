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
import React, { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { Html5QrcodeScanner } from "html5-qrcode";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Initialize scanner when dialog opens
  useEffect(() => {
    if (!isDialogOpen) {
      // Clean up scanner when dialog closes
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
      return;
    }

    // Wait a bit for dialog to fully render
    const timer = setTimeout(() => {
      if (scannerRef.current) return;

      const scanner = new Html5QrcodeScanner(
        "reader",
        {
          qrbox: { width: 250, height: 250 },
          fps: 5,
        },
        false
      );

      scannerRef.current = scanner;

      function success(result: string) {
        CheckQrCode(result);
        // scanner.clear().catch(console.error);
        scannerRef.current = null;
      }

      function error(err: any) {
        console.warn(err);
      }

      scanner.render(success, error);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [isDialogOpen]);

  async function CheckTicketID(id: string) {
    setIsLoading(true);
    if (id.trim()) {
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checking/event/${event.eventId}/ticket-id/${id}`,
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
        closeRef.current?.click(); // Close dialog on success
      } else {
        toast.error(response.message);
      }
    } else {
      setTicketIdError("Enter TicketID");
    }
    setIsLoading(false);
  }
  async function CheckQrCode(id: string) {
    setIsLoading(true);
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/checking/event/${event.eventId}/qr/${id}`,
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
    } else {
      toast.error(response.message);
    }
    setIsLoading(false);
  }

  return (
    <>
      <PageLoader isLoading={isLoading} />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <span>User checkIn</span>
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
            <div
              id="reader"
              className="w-[250px] h-[250px]
                  [&>div]:!border-0
                  [&>div]:!shadow-none
                  [&_video]:!rounded-lg
                  [&_#qr-shaded-region]:!border-2
                  [&_#qr-shaded-region]:!border-neutral-300
                  [&_#qr-shaded-region]:!rounded-lg
                  [&_button]:!bg-neutral-700
                  [&_button]:!text-white
                  [&_button]:!rounded-lg
                  [&_button]:!px-4
                  [&_button]:!py-2
                  [&_button]:!font-medium
                  [&_button]:hover:!bg-neutral-800
                  [&_button]:!transition-colors
                  [&_select]:!rounded-lg
                  [&_select]:!border-neutral-300
                  [&_select]:!px-3
                  [&_select]:!py-2
                "
            ></div>
            {/* <div className="w-full">
              <Input
                autoFocus={false}
                value={ticketID}
                onChange={(e) => setTicketID(e.target.value)}
                error={ticketIdError}
              >
                {t("ticketID")}
              </Input>
            </div> */}
          </div>
          <DialogFooter>
            {/* <ButtonPrimary
              onClick={() => CheckTicketID(ticketID)}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <LoadingCircleSmall /> : t("check_in")}
            </ButtonPrimary> */}
            <DialogClose ref={closeRef} className="sr-only"></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
