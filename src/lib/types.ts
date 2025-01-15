export interface SubjectUnits {
	1: string;
	2: string;
	34: string;
}

/**
 * Describes the acheivements that students must demonstrate across unit.
 */
export interface UnitOutcomes {
	knowledge: string[];
	skills: string[];
}

/**
 * Describes a subject unit in the VCE study design.
 */
export interface UnitStudyDesign {
	/**
	 * The description of the unit.
	 */
	description: string;
	/**
	 * The areas of study in the unit.
	 */
	aos: UnitAreaOfStudy[];
	/**
	 * The outcomes of the units.
	 * it covers.
	 */
	outcomes: UnitOutcomes[];
}

/**
 * Describes an area of study in a VCE subject unit.
 */
export interface UnitAreaOfStudy {
	/**
	 * The name of the area of study.
	 *
	 * @example "Calculus"
	 */
	name: string;
	/**
	 * The number of the area of study.
	 */
	number: number;
	/**
	 * A brief description of the area of study.
	 */
	description: string;
	/**
	 * The points of the area of study, that students are expected to
	 * understand.
	 */
	points: string[];
}