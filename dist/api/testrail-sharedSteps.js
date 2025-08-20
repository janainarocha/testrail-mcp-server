import { TestRailBase } from "./testrail-base.js";
/**
 * TestRail Shared Steps API
 * Handles shared step operations in TestRail (requires TestRail 7.0+)
 */
export class TestRailSharedStepsAPI extends TestRailBase {
    /**
     * Get a specific shared step
     * @param shared_step_id The ID of the shared step
     * @returns Promise<SharedStep>
     */
    async getSharedStep(shared_step_id) {
        const response = await this.makeRequest(`get_shared_step/${shared_step_id}`);
        return response;
    }
    /**
     * Get history of a shared step
     * @param shared_step_id The ID of the shared step
     * @returns Promise<SharedStepHistoryResponse>
     */
    async getSharedStepHistory(shared_step_id) {
        const response = await this.makeRequest(`get_shared_step_history/${shared_step_id}`);
        return response;
    }
    /**
     * Get shared steps for a project
     * @param project_id The ID of the project
     * @param options Optional filters and pagination
     * @returns Promise<SharedStepsResponse>
     */
    async getSharedSteps(project_id, options) {
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
        if (options?.limit) {
            params.append('limit', options.limit.toString());
        }
        if (options?.offset) {
            params.append('offset', options.offset.toString());
        }
        if (options?.updated_after) {
            params.append('updated_after', options.updated_after.toString());
        }
        if (options?.updated_before) {
            params.append('updated_before', options.updated_before.toString());
        }
        if (options?.refs) {
            params.append('refs', options.refs);
        }
        const queryString = params.toString();
        const endpoint = `get_shared_steps/${project_id}${queryString ? '&' + queryString : ''}`;
        return this.makeRequest(endpoint);
    }
    /**
     * Create a new shared step
     * @param project_id The ID of the project
     * @param data The shared step data
     * @returns Promise<SharedStep>
     */
    async addSharedStep(project_id, data) {
        const endpoint = `add_shared_step/${project_id}`;
        return this.makeRequest(endpoint, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
    /**
     * Update an existing shared step
     * @param shared_step_id The ID of the shared step
     * @param data The update data
     * @returns Promise<SharedStep>
     */
    async updateSharedStep(shared_step_id, data) {
        const endpoint = `update_shared_step/${shared_step_id}`;
        return this.makeRequest(endpoint, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
    /**
     * Delete an existing shared step
     * @param shared_step_id The ID of the shared step
     * @param data The delete options
     * @returns Promise<void>
     */
    async deleteSharedStep(shared_step_id, data) {
        const endpoint = `delete_shared_step/${shared_step_id}`;
        await this.makeRequest(endpoint, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
}
//# sourceMappingURL=testrail-sharedSteps.js.map