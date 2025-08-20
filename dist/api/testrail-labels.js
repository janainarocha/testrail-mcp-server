import { TestRailBase } from "./testrail-base.js";
export class TestRailLabelsAPI extends TestRailBase {
    constructor(config) {
        super(config);
    }
    async getLabels(projectId, limit, offset) {
        let endpoint = `get_labels/${projectId}`;
        const params = [];
        if (limit)
            params.push(`limit=${limit}`);
        if (offset)
            params.push(`offset=${offset}`);
        if (params.length > 0) {
            endpoint += `?${params.join("&")}`;
        }
        const response = await this.makeRequest(endpoint);
        return response.labels || response;
    }
    async getLabel(labelId) {
        return await this.makeRequest(`get_label/${labelId}`);
    }
    async updateLabel(labelId, projectId, title) {
        return await this.makeRequest(`update_label/${labelId}`, {
            method: "POST",
            body: JSON.stringify({ project_id: projectId, title }),
        });
    }
}
//# sourceMappingURL=testrail-labels.js.map