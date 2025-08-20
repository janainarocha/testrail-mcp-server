import { TestRailBase } from "./testrail-base.js";
/**
 * Test Result interface
 */
export interface TestResult {
    id: number;
    test_id: number;
    status_id: number;
    created_by: number;
    created_on: number;
    assignedto_id?: number;
    comment?: string;
    version?: string;
    elapsed?: string;
    defects?: string;
    custom_step_results?: any[];
}
/**
 * Test Results Response interface
 */
export interface TestResultsResponse {
    offset: number;
    limit: number;
    size: number;
    _links: {
        next?: string;
        prev?: string;
    };
    results: TestResult[];
}
/**
 * Get Results Options interface
 */
export interface GetResultsOptions {
    limit?: number;
    offset?: number;
    status_id?: number[];
    defects_filter?: string;
    created_after?: number;
    created_before?: number;
    created_by?: number[];
}
/**
 * Add Result interface
 */
export interface AddResultData {
    status_id?: number;
    comment?: string;
    version?: string;
    elapsed?: string;
    defects?: string;
    assignedto_id?: number;
    custom_step_results?: Array<{
        content: string;
        expected: string;
        actual: string;
        status_id: number;
    }>;
    [key: string]: any;
}
/**
 * Bulk Results interface
 */
export interface BulkResultData {
    test_id: number;
    status_id?: number;
    comment?: string;
    version?: string;
    elapsed?: string;
    defects?: string;
    assignedto_id?: number;
    custom_step_results?: Array<{
        content: string;
        expected: string;
        actual: string;
        status_id: number;
    }>;
    [key: string]: any;
}
/**
 * Bulk Results for Cases interface
 */
export interface BulkResultForCaseData {
    case_id: number;
    status_id?: number;
    comment?: string;
    version?: string;
    elapsed?: string;
    defects?: string;
    assignedto_id?: number;
    custom_step_results?: Array<{
        content: string;
        expected: string;
        actual: string;
        status_id: number;
    }>;
    [key: string]: any;
}
/**
 * Result Field interface
 */
export interface ResultField {
    id: number;
    is_active: boolean;
    type_id: number;
    name: string;
    system_name: string;
    label: string;
    description?: string;
    configs: Array<{
        context: {
            is_global: boolean;
            project_ids?: number[] | null;
        };
        id: string;
        options: {
            [key: string]: any;
        };
    }>;
}
/**
 * TestRail Results API
 * Handles test result operations in TestRail
 */
export declare class TestRailResultsAPI extends TestRailBase {
    /**
     * Get test results for a specific test
     * @param test_id The ID of the test
     * @param options Optional filters and pagination
     * @returns Promise<TestResultsResponse>
     */
    getResults(test_id: number, options?: GetResultsOptions): Promise<TestResultsResponse>;
    /**
     * Get test results for a test run and case combination
     * @param run_id The ID of the test run
     * @param case_id The ID of the test case
     * @param options Optional filters and pagination
     * @returns Promise<TestResultsResponse>
     */
    getResultsForCase(run_id: number, case_id: number, options?: GetResultsOptions): Promise<TestResultsResponse>;
    /**
     * Get test results for a test run
     * @param run_id The ID of the test run
     * @param options Optional filters and pagination
     * @returns Promise<TestResultsResponse>
     */
    getResultsForRun(run_id: number, options?: GetResultsOptions): Promise<TestResultsResponse>;
    /**
     * Add a new test result for a specific test
     * @param test_id The ID of the test
     * @param data The result data
     * @returns Promise<TestResult>
     */
    addResult(test_id: number, data: AddResultData): Promise<TestResult>;
    /**
     * Add a new test result for a test run and case combination
     * @param run_id The ID of the test run
     * @param case_id The ID of the test case
     * @param data The result data
     * @returns Promise<TestResult>
     */
    addResultForCase(run_id: number, case_id: number, data: AddResultData): Promise<TestResult>;
    /**
     * Add multiple test results for a test run
     * @param run_id The ID of the test run
     * @param results Array of result data with test IDs
     * @returns Promise<TestResult[]>
     */
    addResults(run_id: number, results: BulkResultData[]): Promise<TestResult[]>;
    /**
     * Add multiple test results for a test run using case IDs
     * @param run_id The ID of the test run
     * @param results Array of result data with case IDs
     * @returns Promise<TestResult[]>
     */
    addResultsForCases(run_id: number, results: BulkResultForCaseData[]): Promise<TestResult[]>;
    /**
     * Get available result custom fields
     * @returns Array of result field definitions
     */
    getResultFields(): Promise<ResultField[]>;
}
