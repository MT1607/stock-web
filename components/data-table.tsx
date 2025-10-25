'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from './ui/skeleton';
import React from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowDoubleClick?: (row: TData) => void;
  isLoading?: boolean;
}

function DataTableInner<TData, TValue>({
  columns,
  data,
  onRowDoubleClick,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  console.log('DataTable data: ', data);

  return (
    <div className="overflow-hidden rounded-md border">
      <Table className="w-full table-fixed">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                onDoubleClick={
                  onRowDoubleClick
                    ? () => onRowDoubleClick(row.original)
                    : undefined
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <>
              {isLoading ? (
                <>
                  {Array.from({ length: 20 }).map((_, index) => (
                    <TableRow className="h-full w-full" key={index}>
                      <TableCell colSpan={columns.length}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <>
                  <TableRow className="h-full w-full">
                    <TableCell colSpan={columns.length}>No results.</TableCell>
                  </TableRow>
                </>
              )}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

const areEqual = <TData, TValue>(
  prevProps: DataTableProps<TData, TValue>,
  nextProps: DataTableProps<TData, TValue>
): boolean => {
  // 1. So sánh tham chiếu Data:
  // Nếu tham chiếu data KHÔNG thay đổi, ta coi như component không cần render lại.
  // Điều này xử lý trường hợp component cha render lại nhưng không fetch data mới.
  if (prevProps.data !== nextProps.data) {
    return false; // Tham chiếu data đã thay đổi -> CẦN render
  }

  // 2. So sánh tham chiếu Columns:
  if (prevProps.columns !== nextProps.columns) {
    return false; // Columns đã thay đổi -> CẦN render
  }

  if (prevProps.isLoading !== nextProps.isLoading) {
    return false; // Trạng thái loading đã thay đổi -> CẦN render
  }

  if (prevProps.onRowDoubleClick !== nextProps.onRowDoubleClick) {
    return false; // Hàm double click đã thay đổi -> CẦN render
  }

  return true;
};

export const DataTable = React.memo(
  DataTableInner,
  areEqual
) as typeof DataTableInner;
