"use client"

import React from "react"
import Image from "next/image"

type Props = React.HTMLAttributes<HTMLDivElement> & {
  name: string
  image: string
}

const NftItem = ({ className, image, name, ...props }: Props) => {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg p-1 hover:bg-white/10">
      <div className="flex items-center gap-2">
        <Image
          src={image}
          height={50}
          width={50}
          alt={name}
          className="size-8 rounded-lg md:size-[50px]"
        />
        {name}
      </div>
    </div>
  )
}

export default NftItem
