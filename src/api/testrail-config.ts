import { TestRailBase, TestRailConfig } from "./testrail-base.js";

export class TestRailConfigAPI extends TestRailBase {
	constructor(config: TestRailConfig) {
		super(config);
	}

	/**
	 * Busca as configurações disponíveis para um projeto no TestRail
	 * @param project_id ID do projeto
	 * @returns Array of configuration groups and configs
	 */
	async getConfigs(project_id: number): Promise<any> {
		return await this.makeRequest(`get_configs/${project_id}`);
	}
}
