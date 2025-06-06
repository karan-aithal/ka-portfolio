import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A shorthand for `twMerge(clsx(...inputs))` to generate a class name
 * from multiple sources.
 *
 * @param inputs - The inputs to generate the class name.
 * @returns The generated class name.
 *
 * @example
 * import { cn } from '@/lib/utils'
 * cn('px-4', 'text-lg') // => 'px-4 text-lg'
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
