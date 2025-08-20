import { TestRailBase } from "./testrail-base.js";
export class TestRailProjectsAPI extends TestRailBase {
    constructor(config) {
        super(config);
    }
    async getProjects() {
        const response = await this.makeRequest("get_projects");
        return response.projects || [];
    }
    async getProject(projectId) {
        return this.makeRequest(`get_project/${projectId}`);
    }
    async getTemplates(projectId) {
        return this.makeRequest(`get_templates/${projectId}`);
    }
}
//# sourceMappingURL=testrail-projects.js.map