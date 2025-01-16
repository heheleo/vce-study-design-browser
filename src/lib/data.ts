/**
 * Provides utilities to help with fetching and parsing data.
 */
import type { SubjectUnits } from "./types";

// The data object that will store all the study design data.
// A mapping of the subject name to its data 
let data: Record<string, SubjectUnits> = {};

export async function fetchStudyDesignData() {
	// Fetch the study design data from the server
	// and store it in the data object.
	const request = await fetch("/study-design.json");
	if(!request.ok) {
		throw new Error("Failed to fetch study design data");
	}

	// Parse the JSON data:
	const studyDesignData = await request.json() as Record<string, SubjectUnits>;
	
	// Store the data in the data object.
	for(const subject in studyDesignData) {
		data[subject] = studyDesignData[subject];
	}
}

/**
 * Gets the study design data for a subject.
 * @param subject The name of the subject to get the study design data for.
 * @returns {SubjectUnits} The study design data for the subject.
 */
export function getStudyDesignData(subject: string) {
	return data[subject];
}

/**
 * Gets the names of all the subjects in the study design data.
 * @returns {string[]} The names of all the subjects in the study design data.
 */
export function getSubjectNames() {
	return Object.keys(data);
}