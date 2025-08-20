import { TestRailBase, TestRailConfig } from "./testrail-base.js";
/**
 * Test Status interface
 */
export interface TestStatus {
    color_bright: number;
    color_dark: number;
    color_medium: number;
    id: number;
    is_final: boolean;
    is_system: boolean;
    is_untested: boolean;
    label: string;
    name: string;
}
/**
 * Case Status interface
 */
export interface CaseStatus {
    case_status_id: number;
    name: string;
    abbreviation?: string;
    is_default: boolean;
    is_approved: boolean;
}
/**
 * TestRail Statuses API
 * Handles test status operations in TestRail
 */
export declare class TestRailStatusesAPI extends TestRailBase {
    constructor(config: TestRailConfig);
    /**
     * Get all available test statuses (system and custom)
     * @returns Promise<TestStatus[]>
     */
    getStatuses(): Promise<TestStatus[]>;
    /**
     * Get all available test case statuses (requires TestRail Enterprise 7.3+)
     * @returns Promise<CaseStatus[]>
     */
    getCaseStatuses(): Promise<CaseStatus[]>;
}
