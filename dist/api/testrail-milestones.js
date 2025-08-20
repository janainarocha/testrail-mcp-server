import { TestRailBase } from "./testrail-base.js";
export class TestRailMilestonesAPI extends TestRailBase {
    constructor(config) {
        super(config);
    }
    async getMilestones(projectId, options = {}) {
        let endpoint = `get_milestones/${projectId}`;
        const params = [];
        if (options.isCompleted !== undefined)
            params.push(`is_completed=${options.isCompleted ? 1 : 0}`);
        if (options.isStarted !== undefined)
            params.push(`is_started=${options.isStarted ? 1 : 0}`);
        if (options.limit)
            params.push(`limit=${options.limit}`);
        if (options.offset)
            params.push(`offset=${options.offset}`);
        if (params.length > 0) {
            endpoint += `?${params.join("&")}`;
        }
        const response = await this.makeRequest(endpoint);
        return response.milestones || response;
    }
    async getMilestone(milestoneId) {
        return await this.makeRequest(`get_milestone/${milestoneId}`);
    }
    /**
     * Creates a new milestone in the given project.
     */
    async addMilestone(projectId, data) {
        return await this.makeRequest(`add_milestone/${projectId}`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
    /**
     * Updates an existing milestone (partial updates supported).
     */
    async updateMilestone(milestoneId, data) {
        return await this.makeRequest(`update_milestone/${milestoneId}`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
}
//# sourceMappingURL=testrail-milestones.js.map