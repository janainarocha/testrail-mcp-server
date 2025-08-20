import { TestRailBase, TestRailConfig } from "./testrail-base.js";
import { Project } from "./testrail-types.js";
export declare class TestRailProjectsAPI extends TestRailBase {
    constructor(config: TestRailConfig);
    getProjects(): Promise<Project[]>;
    getProject(projectId: number): Promise<Project>;
    getTemplates(projectId: number): Promise<any[]>;
}
