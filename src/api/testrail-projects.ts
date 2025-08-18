import { TestRailBase, TestRailConfig } from "./testrail-base.js";
import { Project } from "./testrail-types.js";

export class TestRailProjectsAPI extends TestRailBase {
	constructor(config: TestRailConfig) {
		super(config);
	}

	async getProjects(): Promise<Project[]> {
		const response = await this.makeRequest<{ projects: Project[] }>("get_projects");
		return response.projects || [];
	}

	async getProject(projectId: number): Promise<Project> {
		return this.makeRequest<Project>(`get_project/${projectId}`);
	}

	async getTemplates(projectId: number): Promise<any[]> {
		return this.makeRequest<any[]>(`get_templates/${projectId}`);
	}
}
