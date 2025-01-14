/**
 * Parses a markdown file (which is generated from a VCE study design) and
 * returns a JSON file with study design details about specific VCE subjects.
 */

import fs from 'fs/promises';
import * as prompts from '@inquirer/prompts';

// Request the markdown file path:
const path = await prompts.input({
	message: 'Input the path to the markdown file (relative to cwd)',
	required: true
});

// Performance: record the start time
const startTime = performance.now();

// Determine if the file exists:
const exists = await fs
	.access(path)
	.then(() => true)
	.catch(() => false);
if (!exists) {
	console.error('The file does not exist.');
	process.exit(1);
}

// Read the markdown file:
const fileContent = await fs.readFile(path, 'utf-8');
const fileContentLines = fileContent
	.split('\n')
	.filter((line) => line.trim() !== '' && !line.includes('<!-- -->'));

// Attempt to find all units of the subject(s) from the Table Of Contents.
// Multiple subjects may be present e.g. Mathematics as it spans three different
// subjects. These are then mapped to their anchor, which will be used to find
// the study design details for each unit.
const unitsToAnchorMapping = new Map<string, string>();

const contentsStart = fileContentLines.indexOf('Contents');
if (contentsStart === -1) {
	console.error('Could not find the Table of Contents.');
	process.exit(1);
}

for (var i = contentsStart; i < fileContentLines.length; ++i) {
	const line = fileContentLines[i];
	// This is now past the table of contents:
	if (line.includes('Copyright')) {
		break;
	}

	if (line.includes('Unit') && line.includes('**')) {
		// This line is a unit. Check if it also contains the anchor as
		// it may be located on the next line due to wrapping
		const subject = line.split('**')?.[1];
		let anchor: string | undefined;

		if (line.includes('_Toc')) {
			// In the form:
			// [**SUBJECT** [**27**](#_TocXXXXX)](#_TocXXXXXX)
			anchor = line.match(/#_Toc(\d+)/)?.[0];
		} else {
			// The anchor is on the next line
			// In the form:
			// [**SUBJECT**
			// [**ID**](#_TocXXXXX)](#_TocXXXXX)
			const nextLine = fileContentLines[i + 1];
			anchor = nextLine.match(/#_Toc(\d+)/)?.[0];
		}

		if (anchor && subject) {
			unitsToAnchorMapping.set(subject, anchor);
		}
	}
}

interface SubjectUnits {
	1: string;
	2: string;
	34: string;
}

// The output JSON file should be keyed by subject, with units being
// the children. As a result, create a mapping of subject name to
// their units.
const subjectNameToUnitsMapping = new Map<string, SubjectUnits>();
for (const [subject, _] of unitsToAnchorMapping) {
	const split = subject.split(': ');
	const subjectName = split[1].trim();
	const unit = split[0].trim();

	const units: SubjectUnits = subjectNameToUnitsMapping.get(subjectName) || {
		1: '',
		2: '',
		34: ''
	};

	if (unit === 'Unit 1') {
		units[1] = subject;
	} else if (unit === 'Unit 2') {
		units[2] = subject;
	} else if (unit === 'Units 3 and 4') {
		units[34] = subject;
	}

	subjectNameToUnitsMapping.set(subjectName, units);
}

// Now attempt to find the study design details for each unit.
interface UnitStudyDesign {
	description: string;
	aos: UnitAreaOfStudy[];
}
interface UnitAreaOfStudy {
	name: string;
	number: number;
	description: string;
	points: string[];
}

const unitStudyDesigns = new Map<string, UnitStudyDesign>();
// Store chunks of the raw text content for each unit.
// This seperates everything out.
const unitChunks = new Map<string, string>();
for (const [subject, anchor] of unitsToAnchorMapping) {
	// Get the subject page:
	// Format: []{#_TocXXXXXX .anchor}Unit X: XXX
	const subjectLine = fileContentLines.findIndex(
		(line) => line.includes(anchor) && line.startsWith('[]{') && line.includes('.anchor')
	);
	if (!subjectLine) {
		console.error(`Could not find the subject page for ${subject}.`);
		process.exit(1);
	}

	// Traverse and record the entire chunk for the unit:
	let chunk = '';
	for (var i = subjectLine + 1; i < fileContentLines.length; ++i) {
		const line = fileContentLines[i];
		if (line.includes('.anchor') && !line.toLowerCase().includes('area of study')) {
			// We've reached an unknown anchor, break
			break;
		}

		chunk += line + '\n';
	}

	unitChunks.set(subject, chunk);
}

// Parse the chunks for each unit:
for (const [subject, chunk] of unitChunks) {
	const chunkLines = chunk.split('\n');

	// Attempt to find the description of the unit:
	let description = '';
	for (var i = 0; i < chunkLines.length; ++i) {
		const line = chunkLines[i];
		if (line.startsWith('[]')) {
			// We've reached an anchor, break
			break;
		}

		description += line;
	}

	// Trim the description:
	description = description.trim();

	// Attempt to find each of the area of studies:
	const areaOfStudies: UnitAreaOfStudy[] = [];

	const aosChunks = chunk.split('[]{');
	for (var i = 0; i < aosChunks.length; ++i) {
		if (!aosChunks[i].includes('Area of Study')) {
			continue;
		}

		areaOfStudies.push(parseAOS(aosChunks[i]));
	}

	unitStudyDesigns.set(subject, {
		description,
		aos: areaOfStudies
	});
}

/**
 * Given an AOS chunk, return the parsed data.
 * @param string the chunk of text to parse
 */
function parseAOS(string: string): UnitAreaOfStudy {
	const lines = string.split('\n');
	// Should start with an anchor text, with the AOS number:
	const number = parseInt(lines[0].toLowerCase().split('area of study')[1].trim());
	if (isNaN(number)) {
		console.error(`Failed to parse AOS number for chunk:\n${lines[0]}`);
		process.exit(1);
	}

	// The name of the AOS is on the next line:
	const name = lines[1].trim();

	// Attempt to find the description of the AOS:
	const description = lines[2].trim();

	// Attempt to find the points for the AOS:
	const points: string[] = [];
	for (var i = 0; i < lines.length; ++i) {
		const line = lines[i];
		if (!line.startsWith('-')) {
			// Likely a blank line.
			continue;
		}

		// Replace leading hyphen and trim:
		points.push(line.replace('-', '').trim());
	}

	return {
		name,
		number,
		description,
		points
	};
}

// Output the JSON file:
const output = {};
for (const [subject, units] of subjectNameToUnitsMapping) {
	const subjectUnits = {};
	for (const [unitNo, unitName] of Object.entries(units)) {
		const studyDesign = unitStudyDesigns.get(unitName);
		if (!studyDesign) {
			console.error(`Could not find study design for ${unitName}.`);
			process.exit(1);
		}

		subjectUnits[unitNo] = studyDesign;
	}

	output[subject] = subjectUnits;
}

await fs.writeFile('study-design.json', JSON.stringify(output, null, 2));
console.log(
	`Successfully wrote study-design.json in ${(performance.now() - startTime).toFixed(2)}ms.`
);
