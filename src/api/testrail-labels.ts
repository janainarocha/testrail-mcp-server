import { TestRailBase, TestRailConfig } from "./testrail-base.js";

export class TestRailLabelsAPI extends TestRailBase {
	constructor(config: TestRailConfig) {
		super(config);
	}

	async getLabels(projectId: number, limit?: number, offset?: number): Promise<any[]> {
		let endpoint = `get_labels/${projectId}`;
		const params: string[] = [];
		if (limit) params.push(`limit=${limit}`);
		if (offset) params.push(`offset=${offset}`);
		if (params.length > 0) {
			endpoint += `?${params.join("&")}`;
		}
		const response: any = await this.makeRequest(endpoint);
		return response.labels || response;
	}

	async getLabel(labelId: number): Promise<any> {
		return await this.makeRequest(`get_label/${labelId}`);
	}

	async updateLabel(labelId: number, projectId: number, title: string): Promise<any> {
		return await this.makeRequest(`update_label/${labelId}`, {
			method: "POST",
			body: JSON.stringify({ project_id: projectId, title }),
		});
	}
}
