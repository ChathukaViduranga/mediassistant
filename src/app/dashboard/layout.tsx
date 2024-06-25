"use client";
import { SessionProvider } from "next-auth/react";
import NavBar from "@/components/home/NavBar";
export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <SessionProvider>
        <div className="mx-auto  w-[1280px] h-screen">
          <NavBar />
          <div className="h-5/6">{children}</div>
        </div>
      </SessionProvider>
    </section>
  );
}
