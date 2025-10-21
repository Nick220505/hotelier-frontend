"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Settings,
  User,
  LogOut,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { NotificationsMenu } from "@/components/notifications/notifications-menu";
import { useTheme } from "next-themes";
import { LogoutDialog } from "@/components/auth/logout-dialog";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function Header() {
  const { setTheme, theme } = useTheme();
  const { user, logout, isLoading } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    setShowLogoutDialog(false);
    logout();
  };

  const getThemeIcon = () => {
    if (!mounted) {
      return <Monitor className="h-4 w-4" />;
    }

    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center gap-1 sm:gap-2 border-b px-1 sm:px-2 md:px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200">
        <SidebarTrigger className="-ml-0.5 sm:-ml-1" />
        <Separator orientation="vertical" className="mr-1 sm:mr-2 h-4" />

        <div className="flex items-center flex-1 min-w-0 overflow-hidden">
          <h1 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold text-foreground truncate transition-all duration-200 ml-1 sm:ml-0">
            <span className="hidden xs:inline sm:inline">Hotelier Suite</span>
            <span className="xs:hidden sm:hidden">Hotel</span>
          </h1>
        </div>

        <div className="flex items-center space-x-0.5 sm:space-x-1 md:space-x-2 shrink-0">
          {/* Search - hidden on mobile, shown on larger screens */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 hidden sm:inline-flex"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <NotificationsMenu />

          {/* Theme Toggle - hidden on mobile, shown in user menu instead */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hidden lg:inline-flex"
              >
                {getThemeIcon()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Claro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Oscuro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                Sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full"
              >
                <Avatar className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8">
                  <AvatarImage
                    src={user?.avatar || "/placeholder.svg"}
                    alt={user?.name}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-[10px] sm:text-xs md:text-sm">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Search option for mobile */}
              <DropdownMenuItem className="sm:hidden">
                <Search className="mr-2 h-4 w-4" />
                <span>Buscar</span>
              </DropdownMenuItem>

              {/* Theme options for mobile/tablet */}
              <div className="lg:hidden">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  Tema Claro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  Tema Oscuro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="mr-2 h-4 w-4" />
                  Tema Sistema
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>

              <DropdownMenuItem asChild>
                <Link href="/perfil" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/configuracion" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={() => setShowLogoutDialog(true)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
        isLoading={isLoading}
      />
    </>
  );
}
