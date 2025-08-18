import { TestRailBase, TestRailConfig } from "./testrail-base.js";

export class TestRailStatusesAPI extends TestRailBase {
	constructor(config: TestRailConfig) {
		super(config);
	}

	async getStatuses(): Promise<any[]> {
		return this.makeRequest("get_statuses");
	}

	async getCaseStatuses(): Promise<any[]> {
		return this.makeRequest("get_case_statuses");
	}

	async getResultFields(): Promise<any[]> {
		return this.makeRequest("get_result_fields");
	}
}
