import { TestRailBase, TestRailConfig } from "./testrail-base.js";
export interface Test {
    id: number;
    assignedto_id?: number;
    case_id: number;
    estimate?: string;
    estimate_forecast?: string;
    milestone_id?: number;
    priority_id?: number;
    refs?: string;
    run_id: number;
    status_id: number;
    title: string;
    type_id?: number;
    labels?: Array<{
        id: number;
        title: string;
    }>;
    custom_expected?: string;
    custom_preconds?: string;
    custom_steps_separated?: Array<{
        content: string;
        expected: string;
    }>;
    [key: string]: any;
}
export interface TestsResponse {
    offset: number;
    limit: number;
    size: number;
    _links: {
        next: string | null;
        prev: string | null;
    };
    tests: Test[];
}
export interface GetTestsOptions {
    status_id?: number[];
    limit?: number;
    offset?: number;
    label_id?: number[];
}
export interface UpdateTestRequest {
    labels: Array<number | string>;
}
export interface UpdateTestsRequest {
    test_ids: number[];
    labels: Array<number | string>;
}
export interface UpdateTestsResponse {
    test_ids: number[];
    labels: Array<{
        id: number;
        title: string;
    }>;
}
export declare class TestRailTestsAPI extends TestRailBase {
    constructor(config: TestRailConfig);
    /**
     * Get a specific test by ID
     */
    getTest(testId: number, withData?: string): Promise<Test>;
    /**
     * Get all tests for a test run with optional filtering
     */
    getTests(runId: number, options?: GetTestsOptions): Promise<TestsResponse>;
    /**
     * Update labels assigned to a test
     */
    updateTest(testId: number, labels: Array<number | string>): Promise<Test>;
    /**
     * Update labels assigned to multiple tests with the same values
     */
    updateTests(testIds: number[], labels: Array<number | string>): Promise<UpdateTestsResponse>;
}
