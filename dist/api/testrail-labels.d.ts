import { TestRailBase, TestRailConfig } from "./testrail-base.js";
export declare class TestRailLabelsAPI extends TestRailBase {
    constructor(config: TestRailConfig);
    getLabels(projectId: number, limit?: number, offset?: number): Promise<any[]>;
    getLabel(labelId: number): Promise<any>;
    updateLabel(labelId: number, projectId: number, title: string): Promise<any>;
}
