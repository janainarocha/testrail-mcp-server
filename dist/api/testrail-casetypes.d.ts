import { TestRailBase, TestRailConfig } from "./testrail-base.js";
import { CaseType } from "./testrail-types.js";
export declare class TestRailCaseTypesAPI extends TestRailBase {
    constructor(config: TestRailConfig);
    getCaseTypes(): Promise<CaseType[]>;
}
