import { TestRailBase, TestRailConfig } from "./testrail-base.js";
export interface Template {
    id: number;
    name: string;
    is_default: boolean;
}
export declare class TestRailTemplatesAPI extends TestRailBase {
    constructor(config: TestRailConfig);
    /**
     * Get all available templates for a project
     * Requires TestRail 5.2 or later
     */
    getTemplates(projectId: number): Promise<Template[]>;
}
