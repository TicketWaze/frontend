import React from "react";

export default function AccountPageLoader() {
  return (
    <div
      className={
        "flex flex-col gap-[40px] w-full lg:w-[530px] mx-auto overflow-y-scroll overflow-x-hidden h-full"
      }
    >
      <div className="w-full h-[220px] animate-pulse bg-neutral-200 rounded-[3rem]"></div>
      <div className={"flex flex-col gap-8"}>
        <div
          className={
            "w-full h-[2.5rem] bg-neutral-200 animate-pulse rounded-2xl"
          }
        ></div>
        <div
          className={
            "flex flex-col w-full lg:flex-row lg:justify-between gap-[1.5rem]"
          }
        >
          <div className="w-full h-[60px] bg-neutral-200 rounded-[5rem] animate-pulse"></div>
          <div className="w-full h-[60px] bg-neutral-200 rounded-[5rem] animate-pulse"></div>
        </div>
        <div className="w-full h-[60px] bg-neutral-200 rounded-[5rem] animate-pulse"></div>
        <div className="w-full h-[60px] bg-neutral-200 rounded-[5rem] animate-pulse"></div>
        <div className="w-full h-[60px] bg-neutral-200 rounded-[5rem] animate-pulse"></div>
        <div className="w-full h-[60px] bg-neutral-200 rounded-[5rem] animate-pulse"></div>
      </div>
    </div>
  );
}
