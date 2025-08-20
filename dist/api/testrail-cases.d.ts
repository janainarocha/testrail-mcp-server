import { TestRailBase, TestRailConfig } from "./testrail-base.js";
import { TestCase } from "./testrail-types.js";
export declare class TestRailCasesAPI extends TestRailBase {
    constructor(config: TestRailConfig);
    getCase(caseId: number): Promise<TestCase>;
    getCases(projectId: number, suiteId?: number, sectionId?: number): Promise<TestCase[]>;
    addCase(sectionId: number, testCase: Omit<TestCase, "id" | "section_id">): Promise<TestCase>;
    updateCase(caseId: number, testCase: Partial<TestCase>): Promise<TestCase>;
    deleteCase(caseId: number): Promise<void>;
    getCasesAdvanced(projectId: number, options?: {
        suiteId?: number;
        sectionId?: number;
        filter?: string;
        priorityIds?: number[];
        typeIds?: number[];
        createdAfter?: Date;
        createdBefore?: Date;
        updatedAfter?: Date;
        updatedBefore?: Date;
        createdBy?: number[];
        updatedBy?: number[];
        templateIds?: number[];
        labelIds?: number[];
        refs?: string;
        milestoneIds?: number[];
        limit?: number;
        offset?: number;
    }): Promise<any[]>;
    getCaseHistory(caseId: number, limit?: number, offset?: number): Promise<any[]>;
    updateCasesBatch(suiteId: number, caseIds: number[], updates: Partial<TestCase>): Promise<any>;
    copyCasesToSection(targetSectionId: number, caseIds: number[]): Promise<any>;
    moveCasesToSection(targetSectionId: number, targetSuiteId: number, caseIds: number[]): Promise<any>;
}
