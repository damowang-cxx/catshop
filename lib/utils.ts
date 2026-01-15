import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * 确保字符串以指定前缀开头
 */
export function ensureStartsWith(str: string, prefix: string): string {
  if (str.startsWith(prefix)) {
    return str;
  }
  return `${prefix}${str}`;
}
