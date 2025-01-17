import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * @param string the word
 * @param condition whether to return plural
 * @returns a plural form of the word if the condition is met
 */
export function plural(string: string, condition: boolean) {
	return condition ? string + 's' : string;
}
