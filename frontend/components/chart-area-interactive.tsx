"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { IconTrendingUp, IconActivity } from "@tabler/icons-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
]

const chartConfig = {
  visitors: {
    label: "Patient Visits",
  },
  desktop: {
    label: "In-Person Visits",
    color: "hsl(221, 83%, 53%)",
  },
  mobile: {
    label: "Telemedicine",
    color: "hsl(160, 84%, 39%)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  // Calculate dynamic statistics
  const totalVisits = filteredData.reduce((sum, item) => sum + item.desktop + item.mobile, 0)
  const inPersonVisits = filteredData.reduce((sum, item) => sum + item.desktop, 0)
  const telemedicineVisits = filteredData.reduce((sum, item) => sum + item.mobile, 0)
  const avgDailyVisits = Math.round(totalVisits / filteredData.length)
  const inPersonPercentage = ((inPersonVisits / totalVisits) * 100).toFixed(1)
  const telemedicinePercentage = ((telemedicineVisits / totalVisits) * 100).toFixed(1)

  return (
    <Card className="@container/card relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-gradient-to-br from-zinc-950 via-zinc-950/90 to-zinc-900/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.24)] transition-all duration-500 group">
      {/* Enhanced decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] via-purple-500/[0.01] to-emerald-500/[0.03]" />
      <div className="absolute -right-20 -top-20 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-700">
        <IconActivity className="size-64 text-zinc-400" />
      </div>

      <CardHeader className="relative space-y-6 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-zinc-900/70 to-zinc-900/50 border border-zinc-800/40 shadow-lg shadow-black/5">
              <IconActivity className="size-5 text-zinc-400/90" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold tracking-tight text-zinc-50">
                Patient Visits Analytics
              </CardTitle>
              <CardDescription className="text-zinc-500 mt-1 text-[13px] leading-relaxed">
                <span className="hidden @[540px]/card:block">
                  Monitoring patient engagement and service utilization
                </span>
                <span className="@[540px]/card:hidden">Visit trends</span>
              </CardDescription>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 gap-3 @[540px]/card:grid-cols-4">
          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-gradient-to-br from-zinc-900/60 to-zinc-900/40 border border-zinc-800/40 backdrop-blur-sm hover:from-zinc-900/80 hover:to-zinc-900/60 hover:border-zinc-700/50 hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
            <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Total Visits</span>
            <span className="text-2xl font-semibold tracking-tight text-zinc-50">{totalVisits.toLocaleString()}</span>
          </div>
          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-gradient-to-br from-blue-950/20 to-blue-950/10 border border-blue-900/20 backdrop-blur-sm hover:from-blue-950/30 hover:to-blue-950/15 hover:border-blue-800/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
            <span className="text-[11px] text-blue-400/70 font-medium uppercase tracking-wider">In-Person</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold tracking-tight text-blue-400">{inPersonVisits.toLocaleString()}</span>
              <span className="text-xs text-blue-400/50 font-medium">{inPersonPercentage}%</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-gradient-to-br from-emerald-950/20 to-emerald-950/10 border border-emerald-900/20 backdrop-blur-sm hover:from-emerald-950/30 hover:to-emerald-950/15 hover:border-emerald-800/30 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
            <span className="text-[11px] text-emerald-400/70 font-medium uppercase tracking-wider">Telemedicine</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold tracking-tight text-emerald-400">{telemedicineVisits.toLocaleString()}</span>
              <span className="text-xs text-emerald-400/50 font-medium">{telemedicinePercentage}%</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-gradient-to-br from-zinc-900/60 to-zinc-900/40 border border-zinc-800/40 backdrop-blur-sm hover:from-zinc-900/80 hover:to-zinc-900/60 hover:border-zinc-700/50 hover:shadow-lg hover:shadow-black/5 transition-all duration-300">
            <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Daily Avg</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold tracking-tight text-zinc-50">{avgDailyVisits}</span>
              <Badge variant="outline" className="border-emerald-500/25 bg-emerald-500/10 text-emerald-400 text-[10px] px-1.5 py-0.5 font-medium">
                <IconTrendingUp className="size-2.5" />
              </Badge>
            </div>
          </div>
        </div>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-3.5 *:data-[slot=toggle-group-item]:!py-1.5 *:data-[slot=toggle-group-item]:text-sm *:data-[slot=toggle-group-item]:border-zinc-800/80 *:data-[slot=toggle-group-item]:bg-zinc-900/40 *:data-[slot=toggle-group-item]:text-zinc-400 *:data-[slot=toggle-group-item]:hover:bg-zinc-900 *:data-[slot=toggle-group-item]:hover:text-zinc-300 *:data-[slot=toggle-group-item]:hover:border-zinc-700 *:data-[slot=toggle-group-item]:data-[state=on]:bg-zinc-800 *:data-[slot=toggle-group-item]:data-[state=on]:text-zinc-100 *:data-[slot=toggle-group-item]:data-[state=on]:border-zinc-700 *:data-[slot=toggle-group-item]:data-[state=on]:shadow-sm *:data-[slot=toggle-group-item]:transition-all @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-700 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden transition-all"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-zinc-700 bg-zinc-900">
              <SelectItem value="90d" className="rounded-lg hover:bg-zinc-800 focus:bg-zinc-800">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg hover:bg-zinc-800 focus:bg-zinc-800">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg hover:bg-zinc-800 focus:bg-zinc-800">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-4 pt-8 sm:px-6 pb-6 relative">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[320px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              {/* Bold gradient for In-Person visits */}
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(221, 83%, 53%)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="30%"
                  stopColor="hsl(221, 83%, 53%)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="70%"
                  stopColor="hsl(221, 83%, 53%)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(221, 83%, 53%)"
                  stopOpacity={0.05}
                />
              </linearGradient>
              {/* Bold gradient for Telemedicine */}
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(160, 84%, 39%)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="30%"
                  stopColor="hsl(160, 84%, 39%)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="70%"
                  stopColor="hsl(160, 84%, 39%)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(160, 84%, 39%)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="hsl(240, 3.7%, 15.9%)"
              strokeDasharray="3 3"
              opacity={0.2}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={32}
              tick={{ fill: 'hsl(240, 5%, 45%)', fontSize: 11, fontWeight: 500 }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={38}
              tick={{ fill: 'hsl(240, 5%, 45%)', fontSize: 11, fontWeight: 500 }}
            />
            <ChartTooltip
              cursor={{ stroke: 'hsl(240, 3.7%, 30%)', strokeWidth: 1.5, strokeDasharray: '4 4' }}
              content={
                <ChartTooltipContent
                  className="border-zinc-800/50 bg-zinc-950/95 backdrop-blur-xl shadow-2xl rounded-xl px-4 py-3"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  indicator="line"
                />
              }
            />
            <Area
              dataKey="desktop"
              type="monotone"
              fill="url(#fillDesktop)"
              stroke="hsl(221, 83%, 53%)"
              strokeWidth={3}
              stackId="a"
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
            <Area
              dataKey="mobile"
              type="monotone"
              fill="url(#fillMobile)"
              stroke="hsl(160, 84%, 39%)"
              strokeWidth={3}
              stackId="a"
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ChartContainer>

        {/* Professional Legend */}
        <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-zinc-800/40">
          <div className="flex items-center gap-2.5 group/legend cursor-default">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm group-hover/legend:shadow-blue-500/50 transition-shadow" />
            <span className="text-xs text-zinc-500 font-medium tracking-wide group-hover/legend:text-zinc-400 transition-colors">In-Person</span>
          </div>
          <div className="flex items-center gap-2.5 group/legend cursor-default">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm group-hover/legend:shadow-emerald-500/50 transition-shadow" />
            <span className="text-xs text-zinc-500 font-medium tracking-wide group-hover/legend:text-zinc-400 transition-colors">Telemedicine</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
