"use client"

import React, { Suspense } from "react"

import { Spinner } from "@/components/common"

import Histories from "./components/histories"

export default function page() {
  return (
    <div className=" flex min-h-[500px] w-full flex-col gap-6 pb-10 lg:gap-10 lg:pb-[155px]">
      <div className="flex items-center justify-between gap-2 lg:gap-0">
        <h2 className="text-2xl font-bold leading-10 text-white lg:text-[32px]">
          History
        </h2>
      </div>
      <div className="">
        <Suspense
          fallback={
            <div className="flex justify-center">
              <Spinner />
            </div>
          }
        >
          <Histories />
        </Suspense>
      </div>
    </div>
  )
}
