import { TestRailBase, TestRailConfig } from "./testrail-base.js";
import { Suite } from "./testrail-types.js";

export class TestRailSuitesAPI extends TestRailBase {
	constructor(config: TestRailConfig) {
		super(config);
	}

	async getSuites(projectId: number): Promise<Suite[]> {
		const response = await this.makeRequest<{ suites: Suite[] }>(`get_suites/${projectId}`);
		return response.suites;
	}

	async getSuite(suiteId: number): Promise<Suite> {
		return this.makeRequest<Suite>(`get_suite/${suiteId}`);
	}
}
