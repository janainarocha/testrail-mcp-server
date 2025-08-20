import { TestRailBase, TestRailConfig } from "./testrail-base.js";
import { Suite } from "./testrail-types.js";
export interface CreateSuiteRequest {
    name: string;
    description?: string;
}
export interface UpdateSuiteRequest {
    name?: string;
    description?: string;
}
export interface DeleteSuiteOptions {
    soft?: boolean;
}
export interface SuitesResponse {
    offset: number;
    limit: number;
    size: number;
    _links: {
        next: string | null;
        prev: string | null;
    };
    suites: Suite[];
}
export declare class TestRailSuitesAPI extends TestRailBase {
    constructor(config: TestRailConfig);
    /**
     * Get all test suites for a project
     */
    getSuites(projectId: number): Promise<SuitesResponse>;
    /**
     * Get a specific test suite by ID
     */
    getSuite(suiteId: number): Promise<Suite>;
    /**
     * Create a new test suite
     */
    addSuite(projectId: number, suiteData: CreateSuiteRequest): Promise<Suite>;
    /**
     * Update an existing test suite (partial updates supported)
     */
    updateSuite(suiteId: number, suiteData: UpdateSuiteRequest): Promise<Suite>;
    /**
     * Delete a test suite
     * WARNING: This cannot be undone and deletes all active test runs & results
     */
    deleteSuite(suiteId: number, options?: DeleteSuiteOptions): Promise<any>;
}
