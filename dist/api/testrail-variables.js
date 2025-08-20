import { TestRailBase } from "./testrail-base.js";
export class TestRailVariablesAPI extends TestRailBase {
    constructor(config) {
        super(config);
    }
    /**
     * Get all variables for a project
     * Requires TestRail Enterprise license
     */
    async getVariables(projectId) {
        return this.makeRequest(`get_variables/${projectId}`);
    }
    /**
     * Create a new variable in a project
     * Requires TestRail Enterprise license
     */
    async addVariable(projectId, variableData) {
        return this.makeRequest(`add_variable/${projectId}`, {
            method: 'POST',
            body: JSON.stringify(variableData)
        });
    }
    /**
     * Update an existing variable
     * Requires TestRail Enterprise license
     */
    async updateVariable(variableId, variableData) {
        return this.makeRequest(`update_variable/${variableId}`, {
            method: 'POST',
            body: JSON.stringify(variableData)
        });
    }
    /**
     * Delete a variable
     * WARNING: This will also delete corresponding values from datasets
     * Requires TestRail Enterprise license
     */
    async deleteVariable(variableId) {
        return this.makeRequest(`delete_variable/${variableId}`, {
            method: 'POST'
        });
    }
}
//# sourceMappingURL=testrail-variables.js.map