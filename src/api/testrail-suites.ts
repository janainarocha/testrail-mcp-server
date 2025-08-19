import { TestRailBase, TestRailConfig } from "./testrail-base.js";
import { Suite } from "./testrail-types.js";

export interface CreateSuiteRequest {
	name: string;
	description?: string;
}

export interface UpdateSuiteRequest {
	name?: string;
	description?: string;
}

export interface DeleteSuiteOptions {
	soft?: boolean; // If true, return data on affected items without deleting
}

export interface SuitesResponse {
	offset: number;
	limit: number;
	size: number;
	_links: {
		next: string | null;
		prev: string | null;
	};
	suites: Suite[];
}

export class TestRailSuitesAPI extends TestRailBase {
	constructor(config: TestRailConfig) {
		super(config);
	}

	/**
	 * Get all test suites for a project
	 */
	async getSuites(projectId: number): Promise<SuitesResponse> {
		return this.makeRequest<SuitesResponse>(`get_suites/${projectId}`);
	}

	/**
	 * Get a specific test suite by ID
	 */
	async getSuite(suiteId: number): Promise<Suite> {
		return this.makeRequest<Suite>(`get_suite/${suiteId}`);
	}

	/**
	 * Create a new test suite
	 */
	async addSuite(projectId: number, suiteData: CreateSuiteRequest): Promise<Suite> {
		return this.makeRequest<Suite>(`add_suite/${projectId}`, {
			method: 'POST',
			body: JSON.stringify(suiteData)
		});
	}

	/**
	 * Update an existing test suite (partial updates supported)
	 */
	async updateSuite(suiteId: number, suiteData: UpdateSuiteRequest): Promise<Suite> {
		return this.makeRequest<Suite>(`update_suite/${suiteId}`, {
			method: 'POST',
			body: JSON.stringify(suiteData)
		});
	}

	/**
	 * Delete a test suite
	 * WARNING: This cannot be undone and deletes all active test runs & results
	 */
	async deleteSuite(suiteId: number, options: DeleteSuiteOptions = {}): Promise<any> {
		const url = options.soft ? `delete_suite/${suiteId}?soft=1` : `delete_suite/${suiteId}`;
		return this.makeRequest<any>(url, {
			method: 'POST'
		});
	}
}
