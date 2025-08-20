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
export declare class TestRailVariablesAPI extends TestRailBase {
    constructor(config: TestRailConfig);
    /**
     * Get all variables for a project
     * Requires TestRail Enterprise license
     */
    getVariables(projectId: number): Promise<VariablesResponse>;
    /**
     * Create a new variable in a project
     * Requires TestRail Enterprise license
     */
    addVariable(projectId: number, variableData: CreateVariableRequest): Promise<Variable>;
    /**
     * Update an existing variable
     * Requires TestRail Enterprise license
     */
    updateVariable(variableId: number, variableData: UpdateVariableRequest): Promise<Variable>;
    /**
     * Delete a variable
     * WARNING: This will also delete corresponding values from datasets
     * Requires TestRail Enterprise license
     */
    deleteVariable(variableId: number): Promise<void>;
}
