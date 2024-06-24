"use client";
import Image from "next/image";
import NavBar from "@/components/home/NavBar";
import bgpic from "@/asserts/doctorBg.svg";
import { Advent_Pro } from "next/font/google";
import { SessionProvider } from "next-auth/react";

const advent = Advent_Pro({ subsets: ["latin"] });
export default function Home() {
  return (
    <div className="bg-white w-full h-screen ">
      <div className=" mx-auto  w-[1280px] h-5/6">
        <SessionProvider>
          <NavBar />
        </SessionProvider>

        <div className="flex w-full items-center justify-between h-full">
          <div className="w-5/12 ml-40 h-80  text-bold italic text-7xl ">
            <p className={advent.className}>
              "...The Best Assistant to your journey as a Medical Student..."
            </p>
          </div>
          <div className="w-5/12">
            <Image className="mx-auto" src={bgpic} alt="3d doctor" />
          </div>
        </div>
      </div>
    </div>
  );
}
