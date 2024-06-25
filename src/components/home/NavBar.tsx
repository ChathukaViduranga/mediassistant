import Image from "next/image";
import logo from "@/asserts/logo.svg";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function NavBar() {
  const { data: session, status } = useSession();
  const profile = session?.user?.image!;
  return (
    <div className="w-full flex justify-between">
      <div className="w-3/12">
        <Image alt="mediu logo" src={logo} width={500} height={200} />
      </div>
      <div className="w-7/12 flex justify-between px-10  items-center">
        <Link href={"/"}>
          <Button className="text-sm" variant="link">
            HOME
          </Button>
        </Link>
        <Link href={"/dashboard"}>
          <Button className="text-sm" variant="link">
            DASHBOARD
          </Button>
        </Link>

        {session ? (
          <Dialog>
            <DialogTrigger>
              <Avatar>
                <AvatarImage src={profile} />
                <AvatarFallback>{session.user?.email}</AvatarFallback>
              </Avatar>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  <h1 className="text-4xl text-center">Profile</h1>
                  <Avatar className="mt-4 mx-auto w-20 h-20">
                    <AvatarImage src={profile} />
                    <AvatarFallback>{session.user?.email}</AvatarFallback>
                  </Avatar>
                </DialogTitle>
                <DialogDescription className="ml-10 ">
                  <p className="text-xl mt-10">Name</p>
                  <p className="text-xl text-black">{session.user?.name}</p>
                  <p className="text-xl mt-4">email</p>
                  <p className="text-xl text-black">{session.user?.email}</p>
                  <Link href={"/api/auth/signout"}>
                    <Button className="mt-10 mx-auto" variant="destructive">
                      Logout
                    </Button>
                  </Link>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        ) : (
          <Link href={"/api/auth/signin"}>
            <Button className="text-white bg-black text-sm">Sign In</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default NavBar;
