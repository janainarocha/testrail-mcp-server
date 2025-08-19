import { TestRailBase, TestRailConfig } from "./testrail-base.js";

/**
 * Test Status interface
 */
export interface TestStatus {
	color_bright: number;
	color_dark: number;
	color_medium: number;
	id: number;
	is_final: boolean;
	is_system: boolean;
	is_untested: boolean;
	label: string;
	name: string;
}

/**
 * Case Status interface
 */
export interface CaseStatus {
	case_status_id: number;
	name: string;
	abbreviation?: string;
	is_default: boolean;
	is_approved: boolean;
}

/**
 * TestRail Statuses API
 * Handles test status operations in TestRail
 */
export class TestRailStatusesAPI extends TestRailBase {
	constructor(config: TestRailConfig) {
		super(config);
	}

	/**
	 * Get all available test statuses (system and custom)
	 * @returns Promise<TestStatus[]>
	 */
	async getStatuses(): Promise<TestStatus[]> {
		return this.makeRequest<TestStatus[]>("get_statuses");
	}

	/**
	 * Get all available test case statuses (requires TestRail Enterprise 7.3+)
	 * @returns Promise<CaseStatus[]>
	 */
	async getCaseStatuses(): Promise<CaseStatus[]> {
		return this.makeRequest<CaseStatus[]>("get_case_statuses");
	}
}
