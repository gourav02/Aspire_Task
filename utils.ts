import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRandomCardNumber = (): string => {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
};

export const generateRandomCVV = (): string => {
  return Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('');
};

export const generateExpiryDate = (): string => {
  const month = Math.floor(Math.random() * 12) + 1;
  const year = new Date().getFullYear() + Math.floor(Math.random() * 5) + 1;
  return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' }).format(amount).replace('SGD', 'S$');
};
