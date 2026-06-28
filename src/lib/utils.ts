import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getRoleColor(role: string) {
  const colors: Record<string, string> = {
    student: "bg-blue-100 text-blue-700",
    alumni: "bg-purple-100 text-purple-700",
    faculty: "bg-green-100 text-green-700",
    investor: "bg-amber-100 text-amber-700",
    admin: "bg-slate-100 text-slate-700",
  };
  return colors[role] ?? "bg-gray-100 text-gray-700";
}

export function getRoleBadgeColor(role: string) {
  const colors: Record<string, string> = {
    student: "bg-blue-500",
    alumni: "bg-purple-500",
    faculty: "bg-green-500",
    investor: "bg-amber-500",
    admin: "bg-slate-500",
    organisation: "bg-teal-500",
  };
  return colors[role] ?? "bg-gray-500";
}
