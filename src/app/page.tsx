"use client";
import Link from "next/link";
import Email from "@/components/Email";
import { SessionProvider } from "next-auth/react";
export default function Home() {
  return (
    <div>
      <SessionProvider>
        <Email />
      </SessionProvider>
      <Link href="api/auth/signout">logout</Link>
    </div>
  );
}
