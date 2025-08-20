import { TestRailBase } from "./testrail-base.js";
/**
 * TestRail Statuses API
 * Handles test status operations in TestRail
 */
export class TestRailStatusesAPI extends TestRailBase {
    constructor(config) {
        super(config);
    }
    /**
     * Get all available test statuses (system and custom)
     * @returns Promise<TestStatus[]>
     */
    async getStatuses() {
        return this.makeRequest("get_statuses");
    }
    /**
     * Get all available test case statuses (requires TestRail Enterprise 7.3+)
     * @returns Promise<CaseStatus[]>
     */
    async getCaseStatuses() {
        return this.makeRequest("get_case_statuses");
    }
}
//# sourceMappingURL=testrail-statuses.js.map