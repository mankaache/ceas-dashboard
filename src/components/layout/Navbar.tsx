import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Image from "next/image";
import { commonImages } from "@/assets";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { LuSearch as Search } from "react-icons/lu";
import { Button } from "../ui/button";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/router";
import { CONSTANTS } from "@/data";

const Navbar = () => {
  const [signOut, loading, error] = useSignOut(auth);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/auth/login");
  };

  const { pathname } = useRouter();
  const media = React.useMemo(() => CONSTANTS.DATA_MAP, []);
  const menu = React.useMemo(() => CONSTANTS.MENU_MAP, []);
  const pathLabel = React.useMemo(() => pathname.slice(1), [pathname]);

  return (
    <div className="h-[75px] bg-white flex items-center justify-end shadow-sm px-4 py-2">
      <div className="max-w-screen-xl w-full flex items-center justify-end mx-auto">
        <Breadcrumb className="flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="#">Tableau De Bord</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {media.hasOwnProperty(pathLabel) ? (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="#">Mediatheque</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="capitalize">
                    {
                      // @ts-ignore
                      media[pathLabel]
                    }
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : menu.hasOwnProperty(pathLabel) ? (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="capitalize">
                    {
                      // @ts-ignore
                      menu[pathLabel]
                    }
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <></>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="relative ml-auto mr-4 flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full h-[50px] w-[50px] relative"
            >
              <Image
                src={commonImages.logo}
                fill
                objectFit="cover"
                alt="Avatar"
                className="overflow-hidden rounded-full"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
