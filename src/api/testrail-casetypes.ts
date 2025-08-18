import { TestRailBase, TestRailConfig } from "./testrail-base.js";
import { CaseType } from "./testrail-types.js";

export class TestRailCaseTypesAPI extends TestRailBase {
	constructor(config: TestRailConfig) {
		super(config);
	}

	async getCaseTypes(): Promise<CaseType[]> {
		return this.makeRequest<CaseType[]>("get_case_types");
	}
}
