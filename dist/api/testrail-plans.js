import { TestRailBase } from "./testrail-base.js";
export class TestRailPlansAPI extends TestRailBase {
    constructor(config) {
        super(config);
    }
    /**
     * Get a test plan by ID
     */
    async getPlan(planId) {
        return await this.makeRequest(`get_plan/${planId}`);
    }
    /**
     * Get a list of test plans for a project (with filters)
     */
    async getPlans(projectId, options = {}) {
        let endpoint = `get_plans/${projectId}`;
        const params = [];
        if (options.created_after)
            params.push(`created_after=${options.created_after}`);
        if (options.created_before)
            params.push(`created_before=${options.created_before}`);
        if (options.created_by) {
            const val = Array.isArray(options.created_by) ? options.created_by.join(",") : options.created_by;
            params.push(`created_by=${val}`);
        }
        if (options.is_completed !== undefined)
            params.push(`is_completed=${options.is_completed ? 1 : 0}`);
        if (options.limit)
            params.push(`limit=${options.limit}`);
        if (options.offset)
            params.push(`offset=${options.offset}`);
        if (options.milestone_id) {
            const val = Array.isArray(options.milestone_id) ? options.milestone_id.join(",") : options.milestone_id;
            params.push(`milestone_id=${val}`);
        }
        if (params.length > 0) {
            endpoint += `?${params.join("&")}`;
        }
        const response = await this.makeRequest(endpoint);
        return response.plans || response;
    }
    /**
     * Create a new test plan
     */
    async addPlan(projectId, data) {
        return await this.makeRequest(`add_plan/${projectId}`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
    /**
     * Add one or more new test runs to a test plan
     */
    async addPlanEntry(planId, data) {
        return await this.makeRequest(`add_plan_entry/${planId}`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
    /**
     * Add a new test run to a test plan entry (TestRail 6.4+)
     */
    async addRunToPlanEntry(planId, entryId, data) {
        return await this.makeRequest(`add_run_to_plan_entry/${planId}/${entryId}`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
    /**
     * Update an existing test plan (partial updates supported)
     */
    async updatePlan(planId, data) {
        return await this.makeRequest(`update_plan/${planId}`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
    /**
     * Update one or more groups of test runs in a plan (partial updates supported)
     */
    async updatePlanEntry(planId, entryId, data) {
        return await this.makeRequest(`update_plan_entry/${planId}/${entryId}`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
    /**
     * Update a run inside a plan entry that uses configurations (TestRail 6.4+)
     */
    async updateRunInPlanEntry(runId, data) {
        return await this.makeRequest(`update_run_in_plan_entry/${runId}`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
    /**
     * Close an existing test plan
     */
    async closePlan(planId) {
        return await this.makeRequest(`close_plan/${planId}`, {
            method: "POST",
        });
    }
}
//# sourceMappingURL=testrail-plans.js.map