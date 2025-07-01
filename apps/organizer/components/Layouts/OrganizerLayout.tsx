import React from "react";
import Sidebar from "@/components/Layouts/Sidebar";
import MobileNavigation from "./MobileNavigation";

function OrganizerLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {


  return (
    <div className={"bg-neutral-200 p-[1.5rem] pt-16 lg:p-8 h-dvh overflow-hidden grid lg:grid-cols-10"}>
        <Sidebar className={"col-start-1 col-end-3 pr-8"} />
        <main className="flex flex-col h-full gap-4 lg:col-start-3 lg:col-end-11 overflow-y-scroll lg:overflow-hidden">
          <div className={"bg-white h-full main rounded-[3rem] p-[1.5rem] lg:p-16  overflow-y-scroll lg:overflow-hidden"}>
            {children}
          </div>
          <MobileNavigation />
        </main>
    </div>
  );
}

export default OrganizerLayout;
