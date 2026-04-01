"use client";

import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type BookDemoButtonProps = ComponentProps<"button"> & {
  fullWidthOnMobile?: boolean;
};

export function BookDemoButton({
  className,
  fullWidthOnMobile = false,
  type = "button",
  children = "Book A Demo",
  ...props
}: BookDemoButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "rounded-full bg-[#9810FA] font-semibold text-white transition hover:bg-[#911fdb]",
        "h-11 px-6 text-[15px] lg:h-12.5 lg:text-[16px]",
        fullWidthOnMobile ? "w-full lg:w-57.25" : "w-fit lg:w-57.25",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
