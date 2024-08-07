"use client"

import { logoFont } from "@/fonts/font";
import { useRouter } from "next/navigation";

export default function Logo() {
  const router = useRouter();

  return (
    <div className={`leading-[1.875rem] select-none text-3xl font-bold cursor-pointer ${logoFont}`} onClick={() => {
      router.push("/")
    }}>
      algowar
    </div>
  )
}
