import { TestRailBase, TestRailConfig } from "./testrail-base.js";

export interface Template {
	id: number;
	name: string;
	is_default: boolean;
}

export class TestRailTemplatesAPI extends TestRailBase {
	constructor(config: TestRailConfig) {
		super(config);
	}

	/**
	 * Get all available templates for a project
	 * Requires TestRail 5.2 or later
	 */
	async getTemplates(projectId: number): Promise<Template[]> {
		return this.makeRequest<Template[]>(`get_templates/${projectId}`);
	}
}
