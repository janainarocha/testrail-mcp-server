import { TestRailBase, TestRailConfig } from "./testrail-base.js";
export declare class TestRailMilestonesAPI extends TestRailBase {
    constructor(config: TestRailConfig);
    getMilestones(projectId: number, options?: {
        isCompleted?: boolean;
        isStarted?: boolean;
        limit?: number;
        offset?: number;
    }): Promise<any[]>;
    getMilestone(milestoneId: number): Promise<any>;
    /**
     * Creates a new milestone in the given project.
     */
    addMilestone(projectId: number, data: {
        name: string;
        description?: string;
        due_on?: number;
        parent_id?: number;
        refs?: string;
        start_on?: number;
    }): Promise<any>;
    /**
     * Updates an existing milestone (partial updates supported).
     */
    updateMilestone(milestoneId: number, data: {
        is_completed?: boolean;
        is_started?: boolean;
        parent_id?: number;
        start_on?: number;
    }): Promise<any>;
}
