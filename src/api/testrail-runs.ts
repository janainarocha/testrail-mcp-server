import { TestRailBase } from "./testrail-base.js";

/**
 * Test Run interface
 */
export interface TestRun {
	id: number;
	assignedto_id?: number;
	blocked_count: number;
	completed_on?: number;
	config?: string;
	config_ids?: number[];
	created_by: number;
	created_on: number;
	refs?: string;
	custom_status1_count?: number;
	custom_status2_count?: number;
	custom_status3_count?: number;
	custom_status4_count?: number;
	custom_status5_count?: number;
	custom_status6_count?: number;
	custom_status7_count?: number;
	description?: string;
	failed_count: number;
	include_all: boolean;
	is_completed: boolean;
	milestone_id?: number;
	name: string;
	passed_count: number;
	plan_id?: number;
	project_id: number;
	retest_count: number;
	suite_id?: number;
	untested_count: number;
	updated_on?: number;
	url: string;
	start_on?: number;
	due_on?: number;
}

/**
 * Test Runs Response interface
 */
export interface TestRunsResponse {
	offset: number;
	limit: number;
	size: number;
	_links: {
		next?: string;
		prev?: string;
	};
	runs: TestRun[];
}

/**
 * Get Runs Options interface
 */
export interface GetRunsOptions {
	created_after?: number;
	created_before?: number;
	created_by?: number[];
	is_completed?: boolean;
	limit?: number;
	offset?: number;
	milestone_id?: number[];
	refs_filter?: string;
	suite_id?: number[];
}

/**
 * Add Run Data interface
 */
export interface AddRunData {
	suite_id?: number;
	name: string;
	description?: string;
	milestone_id?: number;
	assignedto_id?: number;
	include_all?: boolean;
	case_ids?: number[];
	refs?: string;
	start_on?: number;
	due_on?: number;
}

/**
 * Update Run Data interface
 */
export interface UpdateRunData {
	name?: string;
	description?: string;
	milestone_id?: number;
	include_all?: boolean;
	case_ids?: number[];
	refs?: string;
	start_on?: number;
	due_on?: number;
}

/**
 * TestRail Runs API
 * Handles test run operations in TestRail
 */
export class TestRailRunsAPI extends TestRailBase {
	/**
	 * Get a specific test run
	 * @param run_id The ID of the test run
	 * @returns Promise<TestRun>
	 */
	async getRun(run_id: number): Promise<TestRun> {
		const response = await this.makeRequest<TestRun>(`get_run/${run_id}`);
		return response;
	}

	/**
	 * Get test runs for a project
	 * @param project_id The ID of the project
	 * @param options Optional filters and pagination
	 * @returns Promise<TestRunsResponse>
	 */
	async getRuns(project_id: number, options?: GetRunsOptions): Promise<TestRunsResponse> {
		const params = new URLSearchParams();
		
		if (options?.created_after) {
			params.append('created_after', options.created_after.toString());
		}
		if (options?.created_before) {
			params.append('created_before', options.created_before.toString());
		}
		if (options?.created_by?.length) {
			params.append('created_by', options.created_by.join(','));
		}
		if (options?.is_completed !== undefined) {
			params.append('is_completed', options.is_completed ? '1' : '0');
		}
		if (options?.limit) {
			params.append('limit', options.limit.toString());
		}
		if (options?.offset) {
			params.append('offset', options.offset.toString());
		}
		if (options?.milestone_id?.length) {
			params.append('milestone_id', options.milestone_id.join(','));
		}
		if (options?.refs_filter) {
			params.append('refs_filter', options.refs_filter);
		}
		if (options?.suite_id?.length) {
			params.append('suite_id', options.suite_id.join(','));
		}

		const queryString = params.toString();
		const endpoint = `get_runs/${project_id}${queryString ? '&' + queryString : ''}`;
		
		return this.makeRequest<TestRunsResponse>(endpoint);
	}

	/**
	 * Create a new test run
	 * @param project_id The ID of the project
	 * @param data The run data
	 * @returns Promise<TestRun>
	 */
	async addRun(project_id: number, data: AddRunData): Promise<TestRun> {
		const endpoint = `add_run/${project_id}`;
		return this.makeRequest<TestRun>(endpoint, {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	/**
	 * Update an existing test run
	 * @param run_id The ID of the test run
	 * @param data The update data
	 * @returns Promise<TestRun>
	 */
	async updateRun(run_id: number, data: UpdateRunData): Promise<TestRun> {
		const endpoint = `update_run/${run_id}`;
		return this.makeRequest<TestRun>(endpoint, {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	/**
	 * Close an existing test run
	 * @param run_id The ID of the test run
	 * @returns Promise<TestRun>
	 */
	async closeRun(run_id: number): Promise<TestRun> {
		const endpoint = `close_run/${run_id}`;
		return this.makeRequest<TestRun>(endpoint, {
			method: "POST",
		});
	}
}
