"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { IconBell, IconSearch } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useProfile } from "@/hooks/useProfile"
import { Activity, Suspense } from "react"
import { useUserStore } from "@/store/user-store"
import { LogOut } from "lucide-react"

export function SiteHeader() {

  const { user } = useProfile();
  const { isLoggedIn } = useUserStore(state => state);

  return (
    <header className="bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800 text-white flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 hover:bg-zinc-800/50" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4 bg-zinc-800"
        />
        <div className="flex flex-col">
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Hospital Dashboard</h1>
          <p className="text-xs text-zinc-500">Real-time overview</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Suspense fallback={<Skeleton className="h-5 w-24 ml-4" />}>
            <p className="text-blue-500">Welcome, {user?.name ?? "Guest"}</p>
          </Suspense>
          <Activity mode={isLoggedIn ? "visible" : "hidden"}>
            <Button variant="outline" size="lg"
              className="relative hover:bg-zinc-800/50 text-zinc-900 hover:text-white transition-colors mx-4 shadow-md flex items-center gap-2 cursor-pointer" >
              <LogOut />
              Logout
            </Button>
          </Activity>
          <Button variant="ghost" size="icon" className="relative hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors">
            <IconSearch className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors">
            <IconBell className="size-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs border-2 border-zinc-950">
              3
            </Badge>
          </Button>
        </div>
      </div>
    </header>
  )
}
