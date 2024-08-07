"use client"

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "./ui/menubar";
import { signOut, useSession } from "next-auth/react";
import { getUser } from "@/hooks/useUser";

export default function Navbar(): ReactNode {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  async function getUserData() {
    const data = await getUser();

    if (data) {
      setIsLoggedIn(true);
    }
  }

  useEffect(() => {
    getUserData();
  }, [])

  function handleLogout() {
    toast.info("This Feature is not developed yet")
  }

  function handleLogin() {
    router.push("/sign-in");
  }

  function handleProfile() {
    router.push("/profile");
    // if () {
    // } else {
    //   toast.error("Login First");
    // }
  }

  return (
    <div className="h-[64px] sticky top-0 z-10 border-b px-8 py-4 w-full flex items-center justify-between bg-background">
      <Logo />
      {/* <Menu
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        handleProfile={handleProfile}
      /> */}
      <div className="hidden items-center gap-4 lg:flex">
        <Button variant="ghost">Leaderboard</Button>
        <Button variant="ghost" onClick={handleProfile}>Profile</Button>
        <Button>Start a Match</Button>
        {isLoggedIn ?
          <Button variant="ghost" onClick={handleLogout}>Logout</Button>
          :
          <Button variant="ghost" onClick={handleLogin}>Login</Button>
        }
      </div>
    </div>
  )
}

// function Menu({ handleProfile, handleLogout, handleLogin }: MenuProps) {
//   return (
//     <Menubar className="border-0 lg:hidden">
//       <MenubarMenu>
//         <MenubarTrigger>
//           <MenuIcon className="w-6 h-6" />
//         </MenubarTrigger>
//         <MenubarContent className="bg-background">
//           <MenubarItem className="cursor-pointer">
//             <div className="px-4 py-2 font-medium">Leaderboard</div>
//           </MenubarItem>
//           <MenubarItem className="cursor-pointer" onClick={handleProfile}>
//             <div className="px-4 py-2 font-medium">Profile</div>
//           </MenubarItem>
//           <MenubarItem className="cursor-pointer" onClick={isLogin ? handleLogout : handleLogin}>
//             <div className="px-4 py-2 font-medium">{isLogin ? "Logout" : "Login"}</div>
//           </MenubarItem>
//           <MenubarSeparator />
//           <MenubarItem className="cursor-pointer">
//             <Button>Start a Match</Button>
//           </MenubarItem>
//         </MenubarContent>
//       </MenubarMenu>
//     </Menubar>
//   )
// }

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}