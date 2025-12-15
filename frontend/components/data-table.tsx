"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconSearch,
  IconTrendingUp,
} from "@tabler/icons-react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-zinc-500 size-7 hover:bg-zinc-800/50 hover:text-blue-400 transition-colors cursor-grab active:cursor-grabbing"
    >
      <IconGripVertical className="size-4" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="border-zinc-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 transition-all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-zinc-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 transition-all"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "header",
    header: () => <span className="font-semibold">Patient Record</span>,
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Section Type",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="border-zinc-700 bg-zinc-800/50 text-zinc-300 px-2.5 py-1 font-medium hover:bg-zinc-800 transition-colors">
          {row.original.type}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`px-2.5 py-1 font-medium transition-all ${row.original.status === "Done"
          ? "border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20"
          : "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
          }`}
      >
        {row.original.status === "Done" ? (
          <IconCircleCheckFilled className="size-4 mr-1" />
        ) : (
          <IconLoader className="size-4 mr-1 animate-spin" />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "target",
    header: () => <div className="w-full text-right">Target</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.header}`,
            success: "Done",
            error: "Error",
          })
        }}
      >
        <Label htmlFor={`${row.original.id}-target`} className="sr-only">
          Target
        </Label>
        <Input
          className="h-8 w-16 border-transparent bg-zinc-900/50 text-right text-zinc-300 shadow-none hover:bg-zinc-800/50 focus-visible:border-blue-500/50 focus-visible:bg-zinc-800/50 focus-visible:ring-1 focus-visible:ring-blue-500/20 transition-all"
          defaultValue={row.original.target}
          id={`${row.original.id}-target`}
        />
      </form>
    ),
  },
  {
    accessorKey: "limit",
    header: () => <div className="w-full text-right">Limit</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.header}`,
            success: "Done",
            error: "Error",
          })
        }}
      >
        <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
          Limit
        </Label>
        <Input
          className="h-8 w-16 border-transparent bg-zinc-900/50 text-right text-zinc-300 shadow-none hover:bg-zinc-800/50 focus-visible:border-blue-500/50 focus-visible:bg-zinc-800/50 focus-visible:ring-1 focus-visible:ring-blue-500/20 transition-all"
          defaultValue={row.original.limit}
          id={`${row.original.id}-limit`}
        />
      </form>
    ),
  },
  {
    accessorKey: "reviewer",
    header: "Reviewer",
    cell: ({ row }) => {
      const isAssigned = row.original.reviewer !== "Assign reviewer"

      if (isAssigned) {
        return row.original.reviewer
      }

      return (
        <>
          <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
            Reviewer
          </Label>
          <Select>
            <SelectTrigger
              className="w-38 border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800/50 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate transition-colors"
              size="sm"
              id={`${row.original.id}-reviewer`}
            >
              <SelectValue placeholder="Assign reviewer" />
            </SelectTrigger>
            <SelectContent align="end" className="border-zinc-700 bg-zinc-900">
              <SelectItem value="Eddie Lake" className="hover:bg-zinc-800">Eddie Lake</SelectItem>
              <SelectItem value="Jamik Tashpulatov" className="hover:bg-zinc-800">
                Jamik Tashpulatov
              </SelectItem>
            </SelectContent>
          </Select>
        </>
      )
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-zinc-800 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 flex size-8 transition-colors"
            size="icon"
          >
            <IconDotsVertical className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 border-zinc-700 bg-zinc-900">
          <DropdownMenuItem className="hover:bg-zinc-800 focus:bg-zinc-800">Edit</DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-zinc-800 focus:bg-zinc-800">Make a copy</DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-zinc-800 focus:bg-zinc-800">Favorite</DropdownMenuItem>
          <DropdownMenuSeparator className="bg-zinc-800" />
          <DropdownMenuItem variant="destructive" className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  const isEven = row.index % 2 === 0

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className={`relative z-0 border-zinc-800 transition-all duration-200 group ${isEven ? 'bg-zinc-950/30' : 'bg-zinc-950/60'
        } hover:bg-gradient-to-r hover:from-zinc-900/80 hover:via-zinc-900/50 hover:to-zinc-900/80 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 data-[dragging=true]:shadow-2xl data-[dragging=true]:shadow-blue-500/20 data-[dragging=true]:scale-[1.02] data-[state=selected]:bg-gradient-to-r data-[state=selected]:from-blue-500/10 data-[state=selected]:via-blue-500/5 data-[state=selected]:to-blue-500/10 data-[state=selected]:border-blue-500/30`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} className="text-zinc-300 group-hover:text-zinc-100 transition-colors">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 shadow-xl overflow-hidden">
        {/* Header Section with Gradient */}
        <div className="relative px-6 pt-6 pb-4 border-b border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-900">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
          <div className="relative flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Patient Records
                </h2>
                <p className="text-sm text-zinc-500 mt-1">Manage and organize patient information</p>
              </div>
              <div className="flex items-center gap-2">

                <Button variant="outline" size="sm" className="border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 transition-colors">
                  <IconPlus className="size-4" />
                  <span className="hidden lg:inline">Add Record</span>
                </Button>
              </div>
            </div>
            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Input
                  placeholder="Search records..."
                  value={(table.getColumn("header")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("header")?.setFilterValue(event.target.value)
                  }
                  className="pl-9 border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 focus:bg-zinc-800 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
              </div>
            </div>
          </div>
        </div>
        <Tabs
          defaultValue="outline"
          className="w-full flex-col justify-start gap-6"
        >
          <TabsContent
            value="outline"
            className="relative flex flex-col gap-6 overflow-auto px-6 pb-6"
          >
            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/30">
              <DndContext
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={handleDragEnd}
                sensors={sensors}
                id={sortableId}
              >
                <Table>
                  <TableHeader className="sticky top-0 z-20 bg-gradient-to-b from-zinc-900 to-zinc-900/95 backdrop-blur-md border-b-2 border-zinc-800 shadow-lg shadow-black/20">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id} className="border-zinc-800 hover:bg-transparent">
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead key={header.id} colSpan={header.colSpan} className="text-zinc-300 font-bold text-xs uppercase tracking-wider">
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                            </TableHead>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody className="**:data-[slot=table-cell]:first:w-8">
                    {table.getRowModel().rows?.length ? (
                      <SortableContext
                        items={dataIds}
                        strategy={verticalListSortingStrategy}
                      >
                        {table.getRowModel().rows.map((row) => (
                          <DraggableRow key={row.id} row={row} />
                        ))}
                      </SortableContext>
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-32 text-center"
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <div className="text-zinc-500 text-lg font-medium">No records found</div>
                            <div className="text-zinc-600 text-sm">Try adjusting your search or filters</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </DndContext>
            </div>
            <div className="flex items-center justify-between px-4 py-4 border-t-2 border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900/95 to-zinc-900 backdrop-blur-sm">
              <div className="text-zinc-500 hidden flex-1 text-sm lg:flex">
                <span className="font-medium text-zinc-400">{table.getFilteredSelectedRowModel().rows.length}</span> of{" "}
                <span className="font-medium text-zinc-400">{table.getFilteredRowModel().rows.length}</span> row(s) selected
              </div>
              <div className="flex w-full items-center gap-8 lg:w-fit">
                <div className="hidden items-center gap-2 lg:flex">
                  <Label htmlFor="rows-per-page" className="text-sm font-medium text-zinc-400">
                    Rows per page
                  </Label>
                  <Select
                    value={`${table.getState().pagination.pageSize}`}
                    onValueChange={(value) => {
                      table.setPageSize(Number(value))
                    }}
                  >
                    <SelectTrigger size="sm" className="w-20 border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 transition-colors" id="rows-per-page">
                      <SelectValue
                        placeholder={table.getState().pagination.pageSize}
                      />
                    </SelectTrigger>
                    <SelectContent side="top" className="border-zinc-700 bg-zinc-900">
                      {[10, 20, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`} className="hover:bg-zinc-800">
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-fit items-center justify-center text-sm font-medium text-zinc-300">
                  Page <span className="mx-1 text-blue-400">{table.getState().pagination.pageIndex + 1}</span> of{" "}
                  <span className="ml-1 text-zinc-400">{table.getPageCount()}</span>
                </div>
                <div className="ml-auto flex items-center gap-2 lg:ml-0">
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to first page</span>
                    <IconChevronsLeft className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="size-8 border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    size="icon"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to previous page</span>
                    <IconChevronLeft className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="size-8 border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    size="icon"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to next page</span>
                    <IconChevronRight className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="hidden size-8 lg:flex border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    size="icon"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to last page</span>
                    <IconChevronsRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-blue-400 hover:text-blue-300 w-fit px-0 text-left font-medium transition-colors">
          {item.header}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.header}</DrawerTitle>
          <DrawerDescription>
            Showing total visitors for the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month{" "}
                  <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Header</Label>
              <Input id="header" defaultValue={item.header} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">Type</Label>
                <Select defaultValue={item.type}>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Table of Contents">
                      Table of Contents
                    </SelectItem>
                    <SelectItem value="Executive Summary">
                      Executive Summary
                    </SelectItem>
                    <SelectItem value="Technical Approach">
                      Technical Approach
                    </SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Capabilities">Capabilities</SelectItem>
                    <SelectItem value="Focus Documents">
                      Focus Documents
                    </SelectItem>
                    <SelectItem value="Narrative">Narrative</SelectItem>
                    <SelectItem value="Cover Page">Cover Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Done">Done</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="target">Target</Label>
                <Input id="target" defaultValue={item.target} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="limit">Limit</Label>
                <Input id="limit" defaultValue={item.limit} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">Reviewer</Label>
              <Select defaultValue={item.reviewer}>
                <SelectTrigger id="reviewer" className="w-full">
                  <SelectValue placeholder="Select a reviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                  <SelectItem value="Jamik Tashpulatov">
                    Jamik Tashpulatov
                  </SelectItem>
                  <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
