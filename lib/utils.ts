import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusPrice = (c: number, pc: number) => {
  if (c > pc) {
    return 'text-green-400';
  }

  if (c < pc) {
    return 'text-red-400';
  }

  return 'text-yellow-400';
};
