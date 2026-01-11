'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./button";

import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { LogOut } from "lucide-react";
import NavItems from "./navItems";

const UserDropdown = () => {
  const router: AppRouterInstance = useRouter();

  const user = {
    name: "Aman",
    email: "contact@singnalist.com",
  };

  const handleSignOut = async (): Promise<void> => {
    router.push("/sign-in");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-3 text-gray-400 hover:text-gray-300"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="cat.png" />
            <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>

          <div className="hidden md:flex flex-col items-start">
        <span className="text-base font-medium text-gray-400 group-hover:text-green-500">
              {user.name}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-gray-400">
        <DropdownMenuLabel>
            <div className="flex relative items-center gap-3 py-2">
            <Avatar className="h-8 w-8">
            <AvatarImage src="cat.png" />
            <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
            <div className="flex flex-col">
        <span className="text-base font-medium text-gray-500">
              {user.name}
            </span>
            <span className="text-sm text-gray-500">{user.email}</span>
          </div>
        </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-600"/>
        <DropdownMenuItem onClick={handleSignOut} className="text-gray-100 font-medium text-md focus:bg-transparent focus:text-green-400 transition-colors">
          <LogOut className="h-4 w-4 mr-2 hidden sm:block"/>
            Logout
        </DropdownMenuItem>
        <DropdownMenuSeparator className="hidden sm:block bg-gray-600"/>

        <nav className="sm:hidden">
            <NavItems/>
        </nav>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
