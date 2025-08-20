import { TestRailBase } from "./testrail-base.js";
export class TestRailTemplatesAPI extends TestRailBase {
    constructor(config) {
        super(config);
    }
    /**
     * Get all available templates for a project
     * Requires TestRail 5.2 or later
     */
    async getTemplates(projectId) {
        return this.makeRequest(`get_templates/${projectId}`);
    }
}
//# sourceMappingURL=testrail-templates.js.map