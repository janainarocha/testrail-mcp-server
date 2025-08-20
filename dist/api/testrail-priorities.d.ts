import { TestRailBase, TestRailConfig } from "./testrail-base.js";
import { Priority } from "./testrail-types.js";
export declare class TestRailPrioritiesAPI extends TestRailBase {
    constructor(config: TestRailConfig);
    getPriorities(): Promise<Priority[]>;
    getPriorityByShortName(shortName: string): Promise<Priority | null>;
}
