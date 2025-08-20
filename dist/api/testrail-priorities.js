import { TestRailBase } from "./testrail-base.js";
export class TestRailPrioritiesAPI extends TestRailBase {
    constructor(config) {
        super(config);
    }
    async getPriorities() {
        return this.makeRequest("get_priorities");
    }
    async getPriorityByShortName(shortName) {
        const priorities = await this.getPriorities();
        return priorities.find((p) => p.short_name === shortName) || null;
    }
}
//# sourceMappingURL=testrail-priorities.js.map