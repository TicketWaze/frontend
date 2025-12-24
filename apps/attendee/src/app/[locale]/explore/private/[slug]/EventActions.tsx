"use client";
import {
  AddEventToFavorite,
  RemoveEventToFavorite,
} from "@/actions/eventActions";
import NoAuthDialog from "@/components/Layouts/NoAuthDialog";
import { LinkPrimary } from "@/components/Links";
import PageLoader from "@/components/Loaders/PageLoader";
import { Link, usePathname } from "@/i18n/navigation";
import Slugify from "@/lib/Slugify";
import TruncateUrl from "@/lib/TruncateUrl";
import { Event, User } from "@workspace/typescript-config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Copy, Heart, MoreCircle, Send2 } from "iconsax-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import Whatsapp from "@workspace/ui/assets/icons/whatsApp.svg";
import Twitter from "@workspace/ui/assets/icons/twitter.svg";
import Linkedin from "@workspace/ui/assets/icons/linkedIn.svg";
import ReportEventComponent from "./ReportEventComponent";
import ReportOrganisationComponent from "./ReportOrganisationComponent";

export default function EventActions({
  event,
  user,
  isFavorite,
}: {
  event: Event;
  user: User;
  isFavorite: boolean;
}) {
  const t = useTranslations("Event");
  const [currentUrl, setCurrentUrl] = useState("");
  const { data: session } = useSession();
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  async function AddToFavorite() {
    setIsLoading(true);
    const result = await AddEventToFavorite(
      user.accessToken,
      event.eventId,
      event.organisationId,
      pathname
    );
    if (result.error) {
      toast.error(result.message);
    }
    setIsLoading(false);
  }
  async function RemoveToFavorite() {
    setIsLoading(true);
    const result = await RemoveEventToFavorite(
      user.accessToken,
      event.eventId,
      event.organisationId,
      pathname
    );
    if (result.error) {
      toast.error(result.message);
    }
    setIsLoading(false);
  }
  const eventLink = currentUrl;
  return (
    <div className="flex items-center justify-between">
      <PageLoader isLoading={isLoading} />
      <div className="flex  gap-8">
        {session?.user && isFavorite && (
          <button
            disabled={isLoading}
            onClick={RemoveToFavorite}
            className="w-[35px] h-[35px] group flex items-center justify-center rounded-[30px] cursor-pointer bg-primary-100"
          >
            <Heart size="20" color="#E45B00" variant="Bulk" />
          </button>
        )}
        {session?.user && !isFavorite && (
          <button
            disabled={isLoading}
            onClick={AddToFavorite}
            className="w-[35px] h-[35px] group flex items-center justify-center bg-neutral-100 rounded-[30px] cursor-pointer hover:bg-primary-100 transition-all ease-in-out duration-500"
          >
            <Heart
              size="20"
              className='"stroke-neutral-700 fill-neutral-700 group-hover:stroke-primary-500 group-hover:fill-primary-500 transition-all ease-in-out duration-500'
              variant="Bulk"
            />
          </button>
        )}
        {!session?.user && (
          <Dialog>
            <DialogTrigger>
              <span className="w-[35px] h-[35px] group flex items-center justify-center bg-neutral-100 rounded-[30px] cursor-pointer hover:bg-primary-100 transition-all ease-in-out duration-500">
                <Heart
                  size="20"
                  className='"stroke-neutral-700 fill-neutral-700 group-hover:stroke-primary-500 group-hover:fill-primary-500 transition-all ease-in-out duration-500'
                  variant="Bulk"
                />
              </span>
            </DialogTrigger>
            <NoAuthDialog />
          </Dialog>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <span className="w-[35px] h-[35px] group flex items-center justify-center bg-neutral-100 rounded-[30px] cursor-pointer hover:bg-primary-100 transition-all ease-in-out duration-500">
              <MoreCircle variant={"Bulk"} color={"#737C8A"} size={20} />
            </span>
          </PopoverTrigger>
          <PopoverContent
            className={
              "bg-neutral-100 border border-neutral-200 right-8 p-4 pb-8 w-[230px]  mb-8 rounded-[1rem] shadow-xl bottom-full flex flex-col gap-4"
            }
          >
            <span
              className={
                "font-medium py-[5px] border-b-[1px] border-neutral-200 text-[1.4rem] text-deep-100 leading-[20px]"
              }
            >
              {t("more")}
            </span>
            <ReportEventComponent event={event} />
            <div className="h-[1px] bg-neutral-200 w-full"></div>
            <ReportOrganisationComponent event={event} />
          </PopoverContent>
        </Popover>
      </div>
      {session?.user ? (
        <LinkPrimary
          href={`/explore/private/${Slugify(event.eventName)}/checkout`}
        >
          {t("buy")}
        </LinkPrimary>
      ) : (
        <Dialog>
          <DialogTrigger>
            <span className="px-[3rem] py-[15px] border-2 border-transparent rounded-[100px] text-center text-white font-medium text-[1.5rem] h-auto leading-[20px] cursor-pointer transition-all duration-400 flex items-center justify-center bg-primary-500 disabled:bg-primary-500/50 hover:bg-primary-500/80 hover:border-primary-600">
              {t("buy")}
            </span>
          </DialogTrigger>
          <NoAuthDialog />
        </Dialog>
      )}
    </div>
  );
}
