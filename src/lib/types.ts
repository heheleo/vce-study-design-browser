/**
 * Describe the VCE study design for a subject.
 */
export type SubjectUnits = {
	/**
	 * The unit 1 study design.
	 */
	'1': UnitStudyDesign;
	/**
	 * The unit 2 study design.
	 */
	'2': UnitStudyDesign;
	/**
	 * The units 3 and 4 study design.
	 */
	'34': UnitStudyDesign;
};

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
	 * The topics of the area of study, that students are expected to
	 * understand. If it doesnt exist, a points array exists instead.
	 */
	topics?: AreaOfStudyTopic[];
	/**
	 * The points of the area of study, that students are expected to understand.
	 * If it doesn't exist, the topics array exists instead.
	 */
	points?: string[];
}

/**
 * Describes a topic within an area of study.
 */
export interface AreaOfStudyTopic {
	/**
	 * The name of the topic
	 */
	name: string;
	/**
	 * The points of the topic that students are expected to understand.
	 */
	points: string[];
}
