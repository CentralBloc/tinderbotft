"use client";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/contexts/auth/hook";
import {routes} from "@/lib/routes";
import {User} from "lucide-react";
import Link from "next/link";
import LogoutButton from "../logout-button";
import MobileDashboardSidebar from "./mobile-dashboard-sidebar";
import {Skeleton} from "../ui/skeleton";
import {ThemeToggle} from "@/components/theme-toogle";
import {usePicture} from "@/services/pictures/hooks";
import {useEffect, useState} from "react";

export default function DashboardHeader() {
  const { user, isLoading } = useAuth();
  const initialAvatar = user?.email ? `https://api.dicebear.com/7.x/lorelei/svg?seed=${user.email}` : "";
  const [avatarSrc, setAvatarSrc] = useState<string>(initialAvatar);
  const { data: pictureData } = usePicture(
    typeof user?.profile_picture === "string" ? user.profile_picture : ""
  );
  useEffect(() => {
    if (pictureData?.link) {
      setAvatarSrc(pictureData.link);
    }
  }, [pictureData]);

  return (
    <div className="fixed inset-x-0 top-0 z-50 mb-8 flex items-center justify-between border-b bg-background py-3">
      <div className="flex items-center gap-x-4">
        <div className="lg:hidden">
          <MobileDashboardSidebar />
        </div>
        <h3 className="hidden text-xl font-medium text-gray-700 dark:text-foreground md:block">
          {!user || isLoading ? (
            <Skeleton className="h-10 w-48" />
          ) : (
            user && `Welcome ${user?.username}`
          )}
        </h3>
      </div>
      {/*{!user || isLoading ? (*/}
      {/*	<Skeleton className="hidden h-10 w-24 md:block" />*/}
      {/*) : (*/}
      {/*	user && (*/}
      {/*		<div className="hidden h-10 items-center justify-center rounded-md border px-4 py-2 dark:border-foreground/50 md:block">*/}
      {/*			<span className="text-gray-700 dark:text-foreground/90">{`${user?.credit} ${*/}
      {/*				user?.credit > 1 ? "Credits" : "Credit"*/}
      {/*			}`}</span>*/}
      {/*		</div>*/}
      {/*	)*/}
      {/*)}*/}
      <div className="flex items-center gap-x-4">
        <ThemeToggle />
        <Button asChild>
          <Link href={routes.dashboard.account.add}>Add new account</Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="relative size-11 rounded-full">
              <Avatar className="border">
                <AvatarImage src={avatarSrc} alt={user?.username} />
                <AvatarFallback>
                  {user?.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.username}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={routes.dashboard.profile}>
                  <User className="mr-2 size-4" aria-hidden="true" />
                  Profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:!bg-destructive/10 dark:hover:!bg-red-500/30">
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}