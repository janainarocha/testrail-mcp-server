import { TestRailBase } from "./testrail-base.js";
export class TestRailTestsAPI extends TestRailBase {
    constructor(config) {
        super(config);
    }
    /**
     * Get a specific test by ID
     */
    async getTest(testId, withData) {
        const url = withData ? `get_test/${testId}?with_data=${withData}` : `get_test/${testId}`;
        return this.makeRequest(url);
    }
    /**
     * Get all tests for a test run with optional filtering
     */
    async getTests(runId, options = {}) {
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
        return this.makeRequest(url);
    }
    /**
     * Update labels assigned to a test
     */
    async updateTest(testId, labels) {
        return this.makeRequest(`update_test/${testId}`, {
            method: 'POST',
            body: JSON.stringify({ labels })
        });
    }
    /**
     * Update labels assigned to multiple tests with the same values
     */
    async updateTests(testIds, labels) {
        return this.makeRequest('update_tests', {
            method: 'POST',
            body: JSON.stringify({
                test_ids: testIds,
                labels
            })
        });
    }
}
//# sourceMappingURL=testrail-tests.js.map