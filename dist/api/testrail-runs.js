import { TestRailBase } from "./testrail-base.js";
/**
 * TestRail Runs API
 * Handles test run operations in TestRail
 */
export class TestRailRunsAPI extends TestRailBase {
    /**
     * Get a specific test run
     * @param run_id The ID of the test run
     * @returns Promise<TestRun>
     */
    async getRun(run_id) {
        const response = await this.makeRequest(`get_run/${run_id}`);
        return response;
    }
    /**
     * Get test runs for a project
     * @param project_id The ID of the project
     * @param options Optional filters and pagination
     * @returns Promise<TestRunsResponse>
     */
    async getRuns(project_id, options) {
        const params = new URLSearchParams();
        if (options?.created_after) {
            params.append('created_after', options.created_after.toString());
        }
        if (options?.created_before) {
            params.append('created_before', options.created_before.toString());
        }
        if (options?.created_by?.length) {
            params.append('created_by', options.created_by.join(','));
        }
        if (options?.is_completed !== undefined) {
            params.append('is_completed', options.is_completed ? '1' : '0');
        }
        if (options?.limit) {
            params.append('limit', options.limit.toString());
        }
        if (options?.offset) {
            params.append('offset', options.offset.toString());
        }
        if (options?.milestone_id?.length) {
            params.append('milestone_id', options.milestone_id.join(','));
        }
        if (options?.refs_filter) {
            params.append('refs_filter', options.refs_filter);
        }
        if (options?.suite_id?.length) {
            params.append('suite_id', options.suite_id.join(','));
        }
        const queryString = params.toString();
        const endpoint = `get_runs/${project_id}${queryString ? '&' + queryString : ''}`;
        return this.makeRequest(endpoint);
    }
    /**
     * Create a new test run
     * @param project_id The ID of the project
     * @param data The run data
     * @returns Promise<TestRun>
     */
    async addRun(project_id, data) {
        const endpoint = `add_run/${project_id}`;
        return this.makeRequest(endpoint, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
    /**
     * Update an existing test run
     * @param run_id The ID of the test run
     * @param data The update data
     * @returns Promise<TestRun>
     */
    async updateRun(run_id, data) {
        const endpoint = `update_run/${run_id}`;
        return this.makeRequest(endpoint, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
    /**
     * Close an existing test run
     * @param run_id The ID of the test run
     * @returns Promise<TestRun>
     */
    async closeRun(run_id) {
        const endpoint = `close_run/${run_id}`;
        return this.makeRequest(endpoint, {
            method: "POST",
        });
    }
}
//# sourceMappingURL=testrail-runs.js.map