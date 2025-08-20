import { TestRailBase } from "./testrail-base.js";
export class TestRailCaseTypesAPI extends TestRailBase {
    constructor(config) {
        super(config);
    }
    async getCaseTypes() {
        return this.makeRequest("get_case_types");
    }
}
//# sourceMappingURL=testrail-casetypes.js.map