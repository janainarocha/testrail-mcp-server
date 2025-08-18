import { TestRailBase, TestRailConfig } from "./testrail-base.js";
import { Section } from "./testrail-types.js";

export class TestRailSectionsAPI extends TestRailBase {
	constructor(config: TestRailConfig) {
		super(config);
	}

	async getSections(projectId: number, suiteId?: number): Promise<Section[]> {
		const endpoint = suiteId ? `get_sections/${projectId}&suite_id=${suiteId}` : `get_sections/${projectId}`;
		const response = await this.makeRequest<{ sections: Section[] }>(endpoint);
		return response.sections;
	}

	async getSection(sectionId: number): Promise<Section> {
		return this.makeRequest<Section>(`get_section/${sectionId}`);
	}
}
