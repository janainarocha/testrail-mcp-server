import { TestRailBase, TestRailConfig } from "./testrail-base.js";
export declare class TestRailConfigAPI extends TestRailBase {
    constructor(config: TestRailConfig);
    /**
     * Busca as configurações disponíveis para um projeto no TestRail
     * @param project_id ID do projeto
     * @returns Array of configuration groups and configs
     */
    getConfigs(project_id: number): Promise<any>;
}
