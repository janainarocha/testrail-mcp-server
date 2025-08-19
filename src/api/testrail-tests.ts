import { TestRailBase, TestRailConfig } from "./testrail-base.js";

export interface Test {
	id: number;
	assignedto_id?: number;
	case_id: number;
	estimate?: string;
	estimate_forecast?: string;
	milestone_id?: number;
	priority_id?: number;
	refs?: string;
	run_id: number;
	status_id: number;
	title: string;
	type_id?: number;
	labels?: Array<{
		id: number;
		title: string;
	}>;
	custom_expected?: string;
	custom_preconds?: string;
	custom_steps_separated?: Array<{
		content: string;
		expected: string;
	}>;
	[key: string]: any; // For additional custom fields
}

export interface TestsResponse {
	offset: number;
	limit: number;
	size: number;
	_links: {
		next: string | null;
		prev: string | null;
	};
	tests: Test[];
}

export interface GetTestsOptions {
	status_id?: number[];
	limit?: number;
	offset?: number;
	label_id?: number[];
}

export interface UpdateTestRequest {
	labels: Array<number | string>;
}

export interface UpdateTestsRequest {
	test_ids: number[];
	labels: Array<number | string>;
}

export interface UpdateTestsResponse {
	test_ids: number[];
	labels: Array<{
		id: number;
		title: string;
	}>;
}

export class TestRailTestsAPI extends TestRailBase {
	constructor(config: TestRailConfig) {
		super(config);
	}

	/**
	 * Get a specific test by ID
	 */
	async getTest(testId: number, withData?: string): Promise<Test> {
		const url = withData ? `get_test/${testId}?with_data=${withData}` : `get_test/${testId}`;
		return this.makeRequest<Test>(url);
	}

	/**
	 * Get all tests for a test run with optional filtering
	 */
	async getTests(runId: number, options: GetTestsOptions = {}): Promise<TestsResponse> {
		const params = new URLSearchParams();
		
		if (options.status_id && options.status_id.length > 0) {
			params.append('status_id', options.status_id.join(','));
		}
		if (options.limit) {
			params.append('limit', options.limit.toString());
		}
		if (options.offset) {
			params.append('offset', options.offset.toString());
		}
		if (options.label_id && options.label_id.length > 0) {
			params.append('label_id', options.label_id.join(','));
		}

		const url = params.toString() ? `get_tests/${runId}?${params.toString()}` : `get_tests/${runId}`;
		return this.makeRequest<TestsResponse>(url);
	}

	/**
	 * Update labels assigned to a test
	 */
	async updateTest(testId: number, labels: Array<number | string>): Promise<Test> {
		return this.makeRequest<Test>(`update_test/${testId}`, {
			method: 'POST',
			body: JSON.stringify({ labels })
		});
	}

	/**
	 * Update labels assigned to multiple tests with the same values
	 */
	async updateTests(testIds: number[], labels: Array<number | string>): Promise<UpdateTestsResponse> {
		return this.makeRequest<UpdateTestsResponse>('update_tests', {
			method: 'POST',
			body: JSON.stringify({
				test_ids: testIds,
				labels
			})
		});
	}
}
