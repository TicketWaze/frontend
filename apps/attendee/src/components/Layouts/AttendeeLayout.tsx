import React from "react";
import Sidebar from "@/components/Layouts/Sidebar";
import MobileNavigation from "./MobileNavigation";
import Head from "next/head";

function AttendeeLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {


  return (
    <>
    <Head>
      <title>{title} - TicketWaze</title>
    </Head>
      <div className={"bg-neutral-200 p-[1.5rem] pt-8 lg:p-8 lg:h-dvh  grid lg:grid-cols-10"}>
        <Sidebar className={"col-start-1 col-end-3 pr-8"} />
        <main className="flex flex-col h-full gap-4 lg:col-start-3 lg:col-end-11 overflow-y-scroll lg:overflow-hidden">
          <div className={"bg-white h-full flex flex-col gap-8 main rounded-[3rem] p-[1.5rem] lg:p-16 pb-32 lg:pb-0  overflow-y-scroll lg:overflow-y-hidden min-h-[90vh]"}>
            {children}
          </div>
          <MobileNavigation className="fixed w-full left-0 bottom-0 bg-neutral-200 p-[1.5rem]" />
        </main>
      </div>
    </>
  );
}

export default AttendeeLayout;
