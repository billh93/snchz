"use client";

import Image from "next/image";
import { WALLPAPERS } from "@/lib/desktop-config";
import { useDesktop } from "./desktop-provider";

export function Wallpaper() {
  const { wallpaper } = useDesktop();
  const wp = WALLPAPERS.find((w) => w.id === wallpaper) ?? WALLPAPERS[0];

  return (
    <div className="fixed inset-0" aria-hidden>
      {wp.image ? (
        <Image
          src={wp.image}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
          draggable={false}
        />
      ) : (
        <div
          className="h-full w-full transition-[background] duration-700"
          style={{ background: wp.style }}
        />
      )}
    </div>
  );
}
