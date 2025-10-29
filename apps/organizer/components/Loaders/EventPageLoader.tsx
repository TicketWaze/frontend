import React from "react";

export default function EventPageLoader() {
  return (
    <div className="flex flex-col gap-12 w-full">
      <div className="w-full flex justify-between items-center">
        <div className="min-w-[318px] w-full lg:w-auto h-[45px] bg-neutral-200 rounded-[3rem] animate-pulse"></div>
        <div className="w-[318px] h-[45px] bg-neutral-200 rounded-[3rem] animate-pulse hidden lg:block"></div>
      </div>
      <div className="list w-full">
        {Array.from({ length: 6 }).map((_, key) => (
          <div
            key={key}
            className="min-w-[255px] h-[280px] rounded-[1rem] bg-neutral-200 animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
}
