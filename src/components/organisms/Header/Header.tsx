"use client";

import { useSession } from "next-auth/react";
import { Avatar, DropdownMenu, DropdownMenuItem } from "@/components/atoms";
import { Bell, Search } from "lucide-react";
import { signOut } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por tracking, destinatario..."
            className="h-10 w-full rounded-lg border bg-muted/50 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <DropdownMenu
          trigger={
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar
                fallback={user?.name?.charAt(0)?.toUpperCase() || "U"}
                className="h-9 w-9"
              />
              <div className="text-left">
                <p className="text-sm font-medium">{user?.name || "Usuario"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          }
        >
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </header>
  );
}
