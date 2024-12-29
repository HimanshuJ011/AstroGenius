import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatContent = (content: string) => {
  return content
    .replace(/\*/g, "") // Remove asterisks
    .replace(/\|/g, ":") // Replace pipe with colon
    .replace(/\-/g, "\t") // Replace dash with tab
    .replace(/#/g, "") // Remove hashtags
    .split(/\d+\.\s/) // Split on numbered list format
    .filter((item) => item.trim() !== "") // Filter out empty strings
    .map((item) => `${item.trim()}`) // Trim each item
    .join("\n"); // Join items with newline
};
