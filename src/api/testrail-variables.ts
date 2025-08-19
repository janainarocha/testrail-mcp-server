import { TestRailBase, TestRailConfig } from "./testrail-base.js";

export interface Variable {
	id: number;
	name: string;
}

export interface VariablesResponse {
	offset: number;
	limit: number;
	size: number;
	_links: {
		next: string | null;
		prev: string | null;
	};
	variables: Variable[];
}

export interface CreateVariableRequest {
	name: string;
}

export interface UpdateVariableRequest {
	name: string;
}

export class TestRailVariablesAPI extends TestRailBase {
	constructor(config: TestRailConfig) {
		super(config);
	}

	/**
	 * Get all variables for a project
	 * Requires TestRail Enterprise license
	 */
	async getVariables(projectId: number): Promise<VariablesResponse> {
		return this.makeRequest<VariablesResponse>(`get_variables/${projectId}`);
	}

	/**
	 * Create a new variable in a project
	 * Requires TestRail Enterprise license
	 */
	async addVariable(projectId: number, variableData: CreateVariableRequest): Promise<Variable> {
		return this.makeRequest<Variable>(`add_variable/${projectId}`, {
			method: 'POST',
			body: JSON.stringify(variableData)
		});
	}

	/**
	 * Update an existing variable
	 * Requires TestRail Enterprise license
	 */
	async updateVariable(variableId: number, variableData: UpdateVariableRequest): Promise<Variable> {
		return this.makeRequest<Variable>(`update_variable/${variableId}`, {
			method: 'POST',
			body: JSON.stringify(variableData)
		});
	}

	/**
	 * Delete a variable
	 * WARNING: This will also delete corresponding values from datasets
	 * Requires TestRail Enterprise license
	 */
	async deleteVariable(variableId: number): Promise<void> {
		return this.makeRequest<void>(`delete_variable/${variableId}`, {
			method: 'POST'
		});
	}
}
