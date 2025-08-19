import { TestRailBase } from "./testrail-base.js";

/**
 * Test Result interface
 */
export interface TestResult {
	id: number;
	test_id: number;
	status_id: number;
	created_by: number;
	created_on: number;
	assignedto_id?: number;
	comment?: string;
	version?: string;
	elapsed?: string;
	defects?: string;
	custom_step_results?: any[];
}

/**
 * Test Results Response interface
 */
export interface TestResultsResponse {
	offset: number;
	limit: number;
	size: number;
	_links: {
		next?: string;
		prev?: string;
	};
	results: TestResult[];
}

/**
 * Get Results Options interface
 */
export interface GetResultsOptions {
	limit?: number;
	offset?: number;
	status_id?: number[];
	defects_filter?: string;
	created_after?: number;
	created_before?: number;
	created_by?: number[];
}

/**
 * Add Result interface
 */
export interface AddResultData {
	status_id?: number;
	comment?: string;
	version?: string;
	elapsed?: string;
	defects?: string;
	assignedto_id?: number;
	custom_step_results?: Array<{
		content: string;
		expected: string;
		actual: string;
		status_id: number;
	}>;
	[key: string]: any; // For custom fields
}

/**
 * Bulk Results interface
 */
export interface BulkResultData {
	test_id: number;
	status_id?: number;
	comment?: string;
	version?: string;
	elapsed?: string;
	defects?: string;
	assignedto_id?: number;
	custom_step_results?: Array<{
		content: string;
		expected: string;
		actual: string;
		status_id: number;
	}>;
	[key: string]: any; // For custom fields
}

/**
 * Bulk Results for Cases interface
 */
export interface BulkResultForCaseData {
	case_id: number;
	status_id?: number;
	comment?: string;
	version?: string;
	elapsed?: string;
	defects?: string;
	assignedto_id?: number;
	custom_step_results?: Array<{
		content: string;
		expected: string;
		actual: string;
		status_id: number;
	}>;
	[key: string]: any; // For custom fields
}

/**
 * Result Field interface
 */
export interface ResultField {
	id: number;
	is_active: boolean;
	type_id: number;
	name: string;
	system_name: string;
	label: string;
	description?: string;
	configs: Array<{
		context: {
			is_global: boolean;
			project_ids?: number[] | null;
		};
		id: string;
		options: {
			[key: string]: any;
		};
	}>;
}

/**
 * TestRail Results API
 * Handles test result operations in TestRail
 */
export class TestRailResultsAPI extends TestRailBase {
	/**
	 * Get test results for a specific test
	 * @param test_id The ID of the test
	 * @param options Optional filters and pagination
	 * @returns Promise<TestResultsResponse>
	 */
	async getResults(test_id: number, options?: GetResultsOptions): Promise<TestResultsResponse> {
		const params = new URLSearchParams();
		
		if (options?.limit) {
			params.append('limit', options.limit.toString());
		}
		if (options?.offset) {
			params.append('offset', options.offset.toString());
		}
		if (options?.status_id?.length) {
			params.append('status_id', options.status_id.join(','));
		}
		if (options?.defects_filter) {
			params.append('defects_filter', options.defects_filter);
		}

		const queryString = params.toString();
		const endpoint = `get_results/${test_id}${queryString ? '&' + queryString : ''}`;
		
		return this.makeRequest<TestResultsResponse>(endpoint);
	}

	/**
	 * Get test results for a test run and case combination
	 * @param run_id The ID of the test run
	 * @param case_id The ID of the test case
	 * @param options Optional filters and pagination
	 * @returns Promise<TestResultsResponse>
	 */
	async getResultsForCase(run_id: number, case_id: number, options?: GetResultsOptions): Promise<TestResultsResponse> {
		const params = new URLSearchParams();
		
		if (options?.limit) {
			params.append('limit', options.limit.toString());
		}
		if (options?.offset) {
			params.append('offset', options.offset.toString());
		}
		if (options?.status_id?.length) {
			params.append('status_id', options.status_id.join(','));
		}
		if (options?.defects_filter) {
			params.append('defects_filter', options.defects_filter);
		}

		const queryString = params.toString();
		const endpoint = `get_results_for_case/${run_id}/${case_id}${queryString ? '&' + queryString : ''}`;
		
		return this.makeRequest<TestResultsResponse>(endpoint);
	}

	/**
	 * Get test results for a test run
	 * @param run_id The ID of the test run
	 * @param options Optional filters and pagination
	 * @returns Promise<TestResultsResponse>
	 */
	async getResultsForRun(run_id: number, options?: GetResultsOptions): Promise<TestResultsResponse> {
		const params = new URLSearchParams();
		
		if (options?.limit) {
			params.append('limit', options.limit.toString());
		}
		if (options?.offset) {
			params.append('offset', options.offset.toString());
		}
		if (options?.status_id?.length) {
			params.append('status_id', options.status_id.join(','));
		}
		if (options?.defects_filter) {
			params.append('defects_filter', options.defects_filter);
		}
		if (options?.created_after) {
			params.append('created_after', options.created_after.toString());
		}
		if (options?.created_before) {
			params.append('created_before', options.created_before.toString());
		}
		if (options?.created_by?.length) {
			params.append('created_by', options.created_by.join(','));
		}

		const queryString = params.toString();
		const endpoint = `get_results_for_run/${run_id}${queryString ? '&' + queryString : ''}`;
		
		return this.makeRequest<TestResultsResponse>(endpoint);
	}

	/**
	 * Add a new test result for a specific test
	 * @param test_id The ID of the test
	 * @param data The result data
	 * @returns Promise<TestResult>
	 */
	async addResult(test_id: number, data: AddResultData): Promise<TestResult> {
		const endpoint = `add_result/${test_id}`;
		return this.makeRequest<TestResult>(endpoint, {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	/**
	 * Add a new test result for a test run and case combination
	 * @param run_id The ID of the test run
	 * @param case_id The ID of the test case
	 * @param data The result data
	 * @returns Promise<TestResult>
	 */
	async addResultForCase(run_id: number, case_id: number, data: AddResultData): Promise<TestResult> {
		const endpoint = `add_result_for_case/${run_id}/${case_id}`;
		return this.makeRequest<TestResult>(endpoint, {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	/**
	 * Add multiple test results for a test run
	 * @param run_id The ID of the test run
	 * @param results Array of result data with test IDs
	 * @returns Promise<TestResult[]>
	 */
	async addResults(run_id: number, results: BulkResultData[]): Promise<TestResult[]> {
		const endpoint = `add_results/${run_id}`;
		return this.makeRequest<TestResult[]>(endpoint, {
			method: "POST",
			body: JSON.stringify({ results }),
		});
	}

	/**
	 * Add multiple test results for a test run using case IDs
	 * @param run_id The ID of the test run
	 * @param results Array of result data with case IDs
	 * @returns Promise<TestResult[]>
	 */
	async addResultsForCases(run_id: number, results: BulkResultForCaseData[]): Promise<TestResult[]> {
		const endpoint = `add_results_for_cases/${run_id}`;
		return this.makeRequest<TestResult[]>(endpoint, {
			method: "POST",
			body: JSON.stringify({ results }),
		});
	}

	/**
	 * Get available result custom fields
	 * @returns Array of result field definitions
	 */
	async getResultFields(): Promise<ResultField[]> {
		const response = await this.makeRequest<ResultField[]>('get_result_fields');
		return response;
	}
}
