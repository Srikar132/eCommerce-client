"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
  VisibilityState,
  RowSelectionState,
} from "@tanstack/react-table";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  isLoading?: boolean;
  isFetching?: boolean;
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  isLoading = false,
  isFetching = false,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current values from URL
  const page = parseInt(searchParams.get("page") || "0");
  const size = parseInt(searchParams.get("size") || "20");
  const sortBy = searchParams.get("sortBy") || "";
  const sortDir = searchParams.get("sortDir") || "DESC";

  // Update URL helper
  const updateURL = (updates: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Table state
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const pagination: PaginationState = {
    pageIndex: page,
    pageSize: size,
  };

  const sorting: SortingState = sortBy
    ? [{ id: sortBy, desc: sortDir === "DESC" }]
    : [];

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;
      updateURL({
        page: newPagination.pageIndex,
        size: newPagination.pageSize,
      });
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === "function" ? updater(sorting) : updater;
      if (newSorting.length > 0) {
        updateURL({
          sortBy: newSorting[0].id,
          sortDir: newSorting[0].desc ? "DESC" : "ASC",
          page: 0, // Reset to first page when sorting
        });
      } else {
        // Clear sorting
        updateURL({
          sortBy: undefined,
          sortDir: undefined,
        });
      }
    },
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Table - Horizontal Scroll Container */}
      <div className="w-full overflow-x-auto rounded-md border" data-table-container>
        <Table className="min-w-full">
          <TableHeader className={cn(
            isFetching && "animate-pulse"
          )}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(onRowClick && "cursor-pointer hover:bg-muted/50")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination - Using Reusable Component */}
      <DataTablePagination table={table} />
    </div>
  );
}