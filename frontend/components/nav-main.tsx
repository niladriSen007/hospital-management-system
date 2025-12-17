"use client"

import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useUserStore } from "@/store/user-store"
import Image from "next/image"
import { Suspense, useState } from "react"
import { Skeleton } from "./ui/skeleton"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { roles } = useUserStore(state => state.currentUser) || { roles: [] };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-12 my-6">
        <SidebarMenu >
          <Suspense fallback={<div>Loading...</div>}>
            <Image src={`https://avatar.vercel.sh/rauchg?rounded=60`} alt="Role Icon" width={80} height={80} className="mx-auto mb-2 border-2 rounded-full p-1 border-green-600" />
            <div className="w-full flex items-center justify-center gap-2 ">
              <span>Role :</span>
              <span>{roles?.length ? roles.join(", ") : <Skeleton className="h-6 w-16" />}</span>
            </div>
          </Suspense>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton className={`bg-black text-white cursor-pointer ${selectedItem === item.title ? "bg-blue-600" : ""}`} tooltip={item.title} onClick={() => {
                setSelectedItem(item.title);
              }}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
