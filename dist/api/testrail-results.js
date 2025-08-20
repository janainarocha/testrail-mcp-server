import { TestRailBase } from "./testrail-base.js";
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
    async getResults(test_id, options) {
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
        return this.makeRequest(endpoint);
    }
    /**
     * Get test results for a test run and case combination
     * @param run_id The ID of the test run
     * @param case_id The ID of the test case
     * @param options Optional filters and pagination
     * @returns Promise<TestResultsResponse>
     */
    async getResultsForCase(run_id, case_id, options) {
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
        return this.makeRequest(endpoint);
    }
    /**
     * Get test results for a test run
     * @param run_id The ID of the test run
     * @param options Optional filters and pagination
     * @returns Promise<TestResultsResponse>
     */
    async getResultsForRun(run_id, options) {
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
        return this.makeRequest(endpoint);
    }
    /**
     * Add a new test result for a specific test
     * @param test_id The ID of the test
     * @param data The result data
     * @returns Promise<TestResult>
     */
    async addResult(test_id, data) {
        const endpoint = `add_result/${test_id}`;
        return this.makeRequest(endpoint, {
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
    async addResultForCase(run_id, case_id, data) {
        const endpoint = `add_result_for_case/${run_id}/${case_id}`;
        return this.makeRequest(endpoint, {
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
    async addResults(run_id, results) {
        const endpoint = `add_results/${run_id}`;
        return this.makeRequest(endpoint, {
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
    async addResultsForCases(run_id, results) {
        const endpoint = `add_results_for_cases/${run_id}`;
        return this.makeRequest(endpoint, {
            method: "POST",
            body: JSON.stringify({ results }),
        });
    }
    /**
     * Get available result custom fields
     * @returns Array of result field definitions
     */
    async getResultFields() {
        const response = await this.makeRequest('get_result_fields');
        return response;
    }
}
//# sourceMappingURL=testrail-results.js.map