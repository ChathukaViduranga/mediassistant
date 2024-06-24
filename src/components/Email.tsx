"use client";
import { Session } from "inspector";
import { useSession } from "next-auth/react";
import Image from "next/image";

function Email() {
  const { data: session, status } = useSession();
  return (
    <div>
      <p>
        {" "}
        {session?.user?.email === "roshansamarathunga27@gmail.com"
          ? "hukahan"
          : "hi"}{" "}
        {session?.user?.name}
      </p>
    </div>
  );
}

export default Email;
