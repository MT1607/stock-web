'use client';

import { Stock } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Stock>[] = [
  {
    accessorKey: 'symbol',
    header: 'Symbol',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'mic',
    header: 'MIC',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
  },
];
