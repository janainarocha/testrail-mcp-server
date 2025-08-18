import { TestRailBase, TestRailConfig } from "./testrail-base.js";

export class TestRailMilestonesAPI extends TestRailBase {
	constructor(config: TestRailConfig) {
		super(config);
	}

	async getMilestones(projectId: number, options: { isCompleted?: boolean; isStarted?: boolean; limit?: number; offset?: number } = {}): Promise<any[]> {
		let endpoint = `get_milestones/${projectId}`;
		const params: string[] = [];
		if (options.isCompleted !== undefined) params.push(`is_completed=${options.isCompleted ? 1 : 0}`);
		if (options.isStarted !== undefined) params.push(`is_started=${options.isStarted ? 1 : 0}`);
		if (options.limit) params.push(`limit=${options.limit}`);
		if (options.offset) params.push(`offset=${options.offset}`);
		if (params.length > 0) {
			endpoint += `?${params.join("&")}`;
		}
		const response: any = await this.makeRequest(endpoint);
		return response.milestones || response;
	}

	async getMilestone(milestoneId: number): Promise<any> {
		return await this.makeRequest(`get_milestone/${milestoneId}`);
	}
	/**
	 * Creates a new milestone in the given project.
	 */
	async addMilestone(
		projectId: number,
		data: {
			name: string;
			description?: string;
			due_on?: number;
			parent_id?: number;
			refs?: string;
			start_on?: number;
		}
	): Promise<any> {
		return await this.makeRequest(`add_milestone/${projectId}`, {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	/**
	 * Updates an existing milestone (partial updates supported).
	 */
	async updateMilestone(
		milestoneId: number,
		data: {
			is_completed?: boolean;
			is_started?: boolean;
			parent_id?: number;
			start_on?: number;
		}
	): Promise<any> {
		return await this.makeRequest(`update_milestone/${milestoneId}`, {
			method: "POST",
			body: JSON.stringify(data),
		});
	}
}
