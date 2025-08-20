import { TestRailBase } from "./testrail-base.js";
export class TestRailCaseFieldsAPI extends TestRailBase {
    constructor(config) {
        super(config);
    }
    async getCaseFields() {
        return await this.makeRequest("get_case_fields");
    }
    async addCaseField(fieldData) {
        return await this.makeRequest("add_case_field", {
            method: "POST",
            body: JSON.stringify(fieldData),
        });
    }
}
//# sourceMappingURL=testrail-casefields.js.map