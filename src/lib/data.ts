/**
 * Provides utilities to help with fetching and parsing data.
 */
import type { SubjectUnits } from './types';

// The data object that will store all the study design data.
// A mapping of the subject name to its data
let data: Record<string, SubjectUnits> = {};

export async function fetchStudyDesignData() {
	// Fetch the study design data from the server
	// and store it in the data object.
	const request = await fetch('/study-design.json');
	if (!request.ok) {
		throw new Error('Failed to fetch study design data');
	}

	// Parse the JSON data:
	const studyDesignData = (await request.json()) as Record<string, SubjectUnits>;

	// Store the data in the data object.
	for (const subject in studyDesignData) {
		data[subject] = studyDesignData[subject];
	}
}

/**
 * Gets the study design data for a subject.
 * @param subject The name of the subject to get the study design data for.
 * @returns {SubjectUnits} The study design data for the subject.
 */
export function getStudyDesignBySubject(subject: string) {
	return data[subject];
}

/**
 * Gets the names of all the subjects in the study design data.
 * @returns {string[]} The names of all the subjects in the study design data.
 */
export function getSubjectNames() {
	return Object.keys(data);
}

interface UnitStatistics {
	totalAOS: number;
	totalOutcomes: number;
}

/**
 * Gets various information about a subject unit, such as the number of areas of
 * study and outcomes.
 * @param subjectName the subject name
 * @param unitName the unit
 * @returns {UnitStatistics} the statistics of the subject
 */
export function getUnitStatistics(subjectName: string, unitName: string): UnitStatistics {
	const statistics = { totalAOS: 0, totalOutcomes: 0 };

	const subject = data[subjectName];
	if (!subject) return statistics;

	const unit = subject?.[unitName as '1' | '2' | '34'];
	if (!unit) return statistics;

	statistics.totalAOS = unit.aos.length;
	statistics.totalOutcomes = unit.outcomes.length;

	return statistics;
}
