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
export declare class TestRailSharedStepsAPI extends TestRailBase {
    /**
     * Get a specific shared step
     * @param shared_step_id The ID of the shared step
     * @returns Promise<SharedStep>
     */
    getSharedStep(shared_step_id: number): Promise<SharedStep>;
    /**
     * Get history of a shared step
     * @param shared_step_id The ID of the shared step
     * @returns Promise<SharedStepHistoryResponse>
     */
    getSharedStepHistory(shared_step_id: number): Promise<SharedStepHistoryResponse>;
    /**
     * Get shared steps for a project
     * @param project_id The ID of the project
     * @param options Optional filters and pagination
     * @returns Promise<SharedStepsResponse>
     */
    getSharedSteps(project_id: number, options?: GetSharedStepsOptions): Promise<SharedStepsResponse>;
    /**
     * Create a new shared step
     * @param project_id The ID of the project
     * @param data The shared step data
     * @returns Promise<SharedStep>
     */
    addSharedStep(project_id: number, data: AddSharedStepData): Promise<SharedStep>;
    /**
     * Update an existing shared step
     * @param shared_step_id The ID of the shared step
     * @param data The update data
     * @returns Promise<SharedStep>
     */
    updateSharedStep(shared_step_id: number, data: UpdateSharedStepData): Promise<SharedStep>;
    /**
     * Delete an existing shared step
     * @param shared_step_id The ID of the shared step
     * @param data The delete options
     * @returns Promise<void>
     */
    deleteSharedStep(shared_step_id: number, data: DeleteSharedStepData): Promise<void>;
}
