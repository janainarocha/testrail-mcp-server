import { TestRailBase } from "./testrail-base.js";

/**
 * Shared Step interface
 */
export interface SharedStep {
	id: number;
	title: string;
	project_id: number;
	created_by: number;
	created_on: number;
	updated_by: number;
	updated_on: number;
	custom_steps_separated: Array<{
		content?: string;
		additional_info?: string;
		expected?: string;
		refs?: string;
	}>;
	case_ids: number[];
}

/**
 * Shared Steps Response interface
 */
export interface SharedStepsResponse {
	offset: number;
	limit: number;
	size: number;
	_links: {
		next?: string;
		prev?: string;
	};
	shared_steps: SharedStep[];
}

/**
 * Shared Step History Entry interface
 */
export interface SharedStepHistoryEntry {
	id: string;
	timestamp: number;
	user_id: string;
	custom_steps_separated: Array<{
		content?: string;
		additional_info?: string;
		expected?: string;
		refs?: string;
	}>;
	title: string;
}

/**
 * Shared Step History Response interface
 */
export interface SharedStepHistoryResponse {
	offset: number;
	limit: number;
	size: number;
	_links: {
		next?: string;
		prev?: string;
	};
	step_history: SharedStepHistoryEntry[];
}

/**
 * Get Shared Steps Options interface
 */
export interface GetSharedStepsOptions {
	created_after?: number;
	created_before?: number;
	created_by?: number[];
	limit?: number;
	offset?: number;
	updated_after?: number;
	updated_before?: number;
	refs?: string;
}

/**
 * Add Shared Step Data interface
 */
export interface AddSharedStepData {
	title: string;
	custom_steps_separated?: Array<{
		content?: string;
		additional_info?: string;
		expected?: string;
		refs?: string;
	}>;
}

/**
 * Update Shared Step Data interface
 */
export interface UpdateSharedStepData {
	title?: string;
	custom_steps_separated?: Array<{
		content?: string;
		additional_info?: string;
		expected?: string;
		refs?: string;
	}>;
}

/**
 * Delete Shared Step Data interface
 */
export interface DeleteSharedStepData {
	keep_in_cases: boolean;
}

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
	async getSharedStep(shared_step_id: number): Promise<SharedStep> {
		const response = await this.makeRequest<SharedStep>(`get_shared_step/${shared_step_id}`);
		return response;
	}

	/**
	 * Get history of a shared step
	 * @param shared_step_id The ID of the shared step
	 * @returns Promise<SharedStepHistoryResponse>
	 */
	async getSharedStepHistory(shared_step_id: number): Promise<SharedStepHistoryResponse> {
		const response = await this.makeRequest<SharedStepHistoryResponse>(`get_shared_step_history/${shared_step_id}`);
		return response;
	}

	/**
	 * Get shared steps for a project
	 * @param project_id The ID of the project
	 * @param options Optional filters and pagination
	 * @returns Promise<SharedStepsResponse>
	 */
	async getSharedSteps(project_id: number, options?: GetSharedStepsOptions): Promise<SharedStepsResponse> {
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
		
		return this.makeRequest<SharedStepsResponse>(endpoint);
	}

	/**
	 * Create a new shared step
	 * @param project_id The ID of the project
	 * @param data The shared step data
	 * @returns Promise<SharedStep>
	 */
	async addSharedStep(project_id: number, data: AddSharedStepData): Promise<SharedStep> {
		const endpoint = `add_shared_step/${project_id}`;
		return this.makeRequest<SharedStep>(endpoint, {
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
	async updateSharedStep(shared_step_id: number, data: UpdateSharedStepData): Promise<SharedStep> {
		const endpoint = `update_shared_step/${shared_step_id}`;
		return this.makeRequest<SharedStep>(endpoint, {
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
	async deleteSharedStep(shared_step_id: number, data: DeleteSharedStepData): Promise<void> {
		const endpoint = `delete_shared_step/${shared_step_id}`;
		await this.makeRequest<void>(endpoint, {
			method: "POST",
			body: JSON.stringify(data),
		});
	}
}
