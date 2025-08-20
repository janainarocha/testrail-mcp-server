import { TestRailBase, TestRailConfig } from "./testrail-base.js";
export declare class TestRailPlansAPI extends TestRailBase {
    constructor(config: TestRailConfig);
    /**
     * Get a test plan by ID
     */
    getPlan(planId: number): Promise<any>;
    /**
     * Get a list of test plans for a project (with filters)
     */
    getPlans(projectId: number, options?: {
        created_after?: number;
        created_before?: number;
        created_by?: number | number[];
        is_completed?: boolean;
        limit?: number;
        offset?: number;
        milestone_id?: number | number[];
    }): Promise<any[]>;
    /**
     * Create a new test plan
     */
    addPlan(projectId: number, data: any): Promise<any>;
    /**
     * Add one or more new test runs to a test plan
     */
    addPlanEntry(planId: number, data: any): Promise<any>;
    /**
     * Add a new test run to a test plan entry (TestRail 6.4+)
     */
    addRunToPlanEntry(planId: number, entryId: string, data: any): Promise<any>;
    /**
     * Update an existing test plan (partial updates supported)
     */
    updatePlan(planId: number, data: any): Promise<any>;
    /**
     * Update one or more groups of test runs in a plan (partial updates supported)
     */
    updatePlanEntry(planId: number, entryId: string, data: any): Promise<any>;
    /**
     * Update a run inside a plan entry that uses configurations (TestRail 6.4+)
     */
    updateRunInPlanEntry(runId: number, data: any): Promise<any>;
    /**
     * Close an existing test plan
     */
    closePlan(planId: number): Promise<any>;
}
