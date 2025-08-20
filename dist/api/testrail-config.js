import { TestRailBase } from "./testrail-base.js";
export class TestRailConfigAPI extends TestRailBase {
    constructor(config) {
        super(config);
    }
    /**
     * Busca as configurações disponíveis para um projeto no TestRail
     * @param project_id ID do projeto
     * @returns Array of configuration groups and configs
     */
    async getConfigs(project_id) {
        return await this.makeRequest(`get_configs/${project_id}`);
    }
}
//# sourceMappingURL=testrail-config.js.map