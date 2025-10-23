'use client';

import { Stock } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

const truncateText = (text: string) => {
  const maxLength = 3;
  if (!text) return '';

  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }

  return text;
};

export const columns: ColumnDef<Stock>[] = [
  {
    accessorKey: 'symbol',
    header: 'Symbol',
    size: 0,
    minSize: 80,
    cell: ({ row }) => {
      const symbol = row.getValue('symbol') as string;
      return (
        <div className="text-left" title={symbol}>
          <span className="sm:hidden">{truncateText(symbol)}</span>
          <span className="hidden sm:block">{symbol}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: () => (
      <div className="flex justify-center">
        <span className="sm:hidden">Des...</span>
        <span className="hidden sm:block">Description</span>
      </div>
    ),
    cell: ({ row }) => {
      const description = row.getValue('description') as string;
      return (
        <div className="text-center" title={description}>
          {/* Dùng useFirstWord = true cho màn hình nhỏ */}
          <span className="sm:hidden">{truncateText(description)}</span>
          <span className="hidden sm:block">{description}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'mic',
    header: () => (
      <div className="flex justify-center">
        <span className="sm:hidden">M...</span>
        <span className="hidden sm:block">MIC</span>
      </div>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('mic')}</div>,
    size: 0,
    minSize: 70, // Giữ minSize
  },
  {
    accessorKey: 'type',
    header: () => (
      <div className="flex justify-center">
        <span className="sm:hidden">T...</span>
        <span className="hidden sm:block">Type</span>
      </div>
    ),
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return (
        <div className="text-center" title={type}>
          {/* Dùng useFirstWord = true cho màn hình nhỏ */}
          <span className="sm:hidden">{truncateText(type)}</span>
          <span className="hidden sm:block">{type}</span>
        </div>
      );
    },
    size: 0,
    minSize: 90, // Tăng minSize một chút nếu nội dung vẫn bị tràn
  },
  {
    accessorKey: 'currency',
    header: () => (
      <div className="flex justify-end">
        <span className="sm:hidden">Cur...</span>
        <span className="hidden sm:block">Currency</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right">{row.getValue('currency')}</div>
    ),
    size: 0,
    minSize: 80,
    maxSize: 100,
  },
];
