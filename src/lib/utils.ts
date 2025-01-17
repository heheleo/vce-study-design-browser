import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { UnitAreaOfStudy } from './types';

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

/**
 * Attempts to copy the specified content into the clipboard.
 */
export function copyContent(content: string) {
	return window.navigator.clipboard.writeText(content);
}

/**
 * Returns a formatted string from an area of string.
 * @param aos the area of study to stringify
 */
export function aosToString(aos: UnitAreaOfStudy) {
	if (aos.points?.length) {
		return 'This area of study covers:\n' + aos.points.map((point) => '- ' + point).join('\n');
	} else if (aos.topics?.length) {
		return aos.topics
			.map((topic) => `Topic: ${topic.name}\n${topic.points.map((point) => '- ' + point).join("\n")}`)
			.join('\n\n');
	}

	return '';
}