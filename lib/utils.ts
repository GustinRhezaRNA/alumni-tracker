import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string) => {
  return name
    .split(' ') // Pisahkan nama berdasarkan spasi
    .map(word => word[0]) // Ambil huruf pertama dari setiap kata
    .join('') // Gabungkan huruf-huruf tersebut
    .toUpperCase() // Ubah ke huruf besar
    .slice(0, 2); // Ambil maksimal 2 huruf pertama
};
