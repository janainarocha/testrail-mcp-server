import { TestRailBase } from "./testrail-base.js";
export class TestRailSuitesAPI extends TestRailBase {
    constructor(config) {
        super(config);
    }
    /**
     * Get all test suites for a project
     */
    async getSuites(projectId) {
        return this.makeRequest(`get_suites/${projectId}`);
    }
    /**
     * Get a specific test suite by ID
     */
    async getSuite(suiteId) {
        return this.makeRequest(`get_suite/${suiteId}`);
    }
    /**
     * Create a new test suite
     */
    async addSuite(projectId, suiteData) {
        return this.makeRequest(`add_suite/${projectId}`, {
            method: 'POST',
            body: JSON.stringify(suiteData)
        });
    }
    /**
     * Update an existing test suite (partial updates supported)
     */
    async updateSuite(suiteId, suiteData) {
        return this.makeRequest(`update_suite/${suiteId}`, {
            method: 'POST',
            body: JSON.stringify(suiteData)
        });
    }
    /**
     * Delete a test suite
     * WARNING: This cannot be undone and deletes all active test runs & results
     */
    async deleteSuite(suiteId, options = {}) {
        const url = options.soft ? `delete_suite/${suiteId}?soft=1` : `delete_suite/${suiteId}`;
        return this.makeRequest(url, {
            method: 'POST'
        });
    }
}
//# sourceMappingURL=testrail-suites.js.map