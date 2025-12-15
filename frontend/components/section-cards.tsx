import {
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
  IconHeartbeat,
  IconBed,
  IconStethoscope
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-6 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Patients Card */}
      <Card className="@container/card relative overflow-hidden border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/50 group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent" />
        <div className="absolute -right-8 -top-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <IconUsers className="size-32 text-blue-500" />
        </div>
        <CardHeader className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
              <IconUsers className="size-5 text-blue-400" />
            </div>
            <CardDescription className="text-zinc-400 font-medium">Total Patients</CardDescription>
          </div>
          <CardTitle className="text-3xl font-bold tabular-nums @[250px]/card:text-4xl bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent">
            2,547
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20">
              <IconTrendingUp className="size-3" />
              +15.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm relative">
          <div className="flex gap-2 font-medium text-zinc-300">
            <IconTrendingUp className="size-4 text-green-400" />
            265 new patients this month
          </div>
          <div className="text-zinc-500">
            Active patients increased by 15%
          </div>
        </CardFooter>
      </Card>

      {/* Appointments Card */}
      <Card className="@container/card relative overflow-hidden border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/50 group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent" />
        <div className="absolute -right-8 -top-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <IconStethoscope className="size-32 text-emerald-500" />
        </div>
        <CardHeader className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <IconStethoscope className="size-5 text-emerald-400" />
            </div>
            <CardDescription className="text-zinc-400 font-medium">Today's Appointments</CardDescription>
          </div>
          <CardTitle className="text-3xl font-bold tabular-nums @[250px]/card:text-4xl bg-gradient-to-br from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            156
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">
              <IconTrendingUp className="size-3" />
              +8.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm relative">
          <div className="flex gap-2 font-medium text-zinc-300">
            <IconTrendingUp className="size-4 text-emerald-400" />
            12 more than yesterday
          </div>
          <div className="text-zinc-500">
            48 completed, 108 pending
          </div>
        </CardFooter>
      </Card>

      {/* Available Beds Card */}
      <Card className="@container/card relative overflow-hidden border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-500/50 group">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent" />
        <div className="absolute -right-8 -top-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <IconBed className="size-32 text-amber-500" />
        </div>
        <CardHeader className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20">
              <IconBed className="size-5 text-amber-400" />
            </div>
            <CardDescription className="text-zinc-400 font-medium">Available Beds</CardDescription>
          </div>
          <CardTitle className="text-3xl font-bold tabular-nums @[250px]/card:text-4xl bg-gradient-to-br from-amber-400 to-amber-600 bg-clip-text text-transparent">
            89/320
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20">
              28% available
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm relative">
          <div className="flex gap-2 font-medium text-zinc-300">
            <IconBed className="size-4 text-amber-400" />
            231 beds occupied
          </div>
          <div className="text-zinc-500">
            72% occupancy rate
          </div>
        </CardFooter>
      </Card>

      {/* Critical Patients Card */}
      <Card className="@container/card relative overflow-hidden border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 hover:border-red-500/50 group">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent" />
        <div className="absolute -right-8 -top-8 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <IconHeartbeat className="size-32 text-red-500" />
        </div>
        <CardHeader className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-red-500/10 ring-1 ring-red-500/20">
              <IconHeartbeat className="size-5 text-red-400" />
            </div>
            <CardDescription className="text-zinc-400 font-medium">Critical Care</CardDescription>
          </div>
          <CardTitle className="text-3xl font-bold tabular-nums @[250px]/card:text-4xl bg-gradient-to-br from-red-400 to-red-600 bg-clip-text text-transparent">
            23
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20">
              <IconTrendingDown className="size-3" />
              -12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm relative">
          <div className="flex gap-2 font-medium text-zinc-300">
            <IconTrendingDown className="size-4 text-green-400" />
            3 less than last week
          </div>
          <div className="text-zinc-500">
            All patients stable
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
