import Image from "next/image";
import logo from "@/asserts/Untitled (500 x 200 px).svg";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

function NavBar() {
  const { data: session, status } = useSession();

  return (
    <div className="w-full flex justify-between">
      <div className="w-3/12">
        <Image alt="mediu logo" src={logo} width={500} height={200} />
      </div>
      <div className="w-7/12 flex justify-between px-10  items-center">
        <Button className="text-sm" variant="link">
          HOME
        </Button>
        <Button className="text-sm" variant="link">
          DASHBOARD
        </Button>

        <Link
          href={
            status == "authenticated" ? "/api/auth/signout" : "/api/auth/signin"
          }
        >
          <Button className="text-white bg-black text-sm">
            {status == "authenticated" ? "Sign Out" : "Sign In"}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NavBar;
