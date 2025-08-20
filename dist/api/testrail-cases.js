import { TestRailBase } from "./testrail-base.js";
export class TestRailCasesAPI extends TestRailBase {
    constructor(config) {
        super(config);
    }
    async getCase(caseId) {
        return this.makeRequest(`get_case/${caseId}`);
    }
    async getCases(projectId, suiteId, sectionId) {
        let endpoint = `get_cases/${projectId}`;
        const params = new URLSearchParams();
        if (suiteId)
            params.append("suite_id", suiteId.toString());
        if (sectionId)
            params.append("section_id", sectionId.toString());
        if (params.toString()) {
            endpoint += `&${params.toString()}`;
        }
        const response = await this.makeRequest(endpoint);
        if (Array.isArray(response)) {
            return response;
        }
        else if (response && response.cases && Array.isArray(response.cases)) {
            return response.cases;
        }
        else {
            console.warn("Unexpected response format from TestRail API:", response);
            return [];
        }
    }
    async addCase(sectionId, testCase) {
        return this.makeRequest(`add_case/${sectionId}`, {
            method: "POST",
            body: JSON.stringify(testCase),
        });
    }
    async updateCase(caseId, testCase) {
        return this.makeRequest(`update_case/${caseId}`, {
            method: "POST",
            body: JSON.stringify(testCase),
        });
    }
    async deleteCase(caseId) {
        await this.makeRequest(`delete_case/${caseId}`, {
            method: "POST",
        });
    }
    async getCasesAdvanced(projectId, options = {}) {
        let endpoint = `get_cases/${projectId}`;
        const params = [];
        if (options.suiteId)
            params.push(`suite_id=${options.suiteId}`);
        if (options.sectionId)
            params.push(`section_id=${options.sectionId}`);
        if (options.filter)
            params.push(`filter=${encodeURIComponent(options.filter)}`);
        if (options.priorityIds?.length)
            params.push(`priority_id=${options.priorityIds.join(",")}`);
        if (options.typeIds?.length)
            params.push(`type_id=${options.typeIds.join(",")}`);
        if (options.createdAfter)
            params.push(`created_after=${Math.floor(options.createdAfter.getTime() / 1000)}`);
        if (options.createdBefore)
            params.push(`created_before=${Math.floor(options.createdBefore.getTime() / 1000)}`);
        if (options.updatedAfter)
            params.push(`updated_after=${Math.floor(options.updatedAfter.getTime() / 1000)}`);
        if (options.updatedBefore)
            params.push(`updated_before=${Math.floor(options.updatedBefore.getTime() / 1000)}`);
        if (options.createdBy?.length)
            params.push(`created_by=${options.createdBy.join(",")}`);
        if (options.updatedBy?.length)
            params.push(`updated_by=${options.updatedBy.join(",")}`);
        if (options.templateIds?.length)
            params.push(`template_id=${options.templateIds.join(",")}`);
        if (options.labelIds?.length)
            params.push(`label_id=${options.labelIds.join(",")}`);
        if (options.refs)
            params.push(`refs=${encodeURIComponent(options.refs)}`);
        if (options.milestoneIds?.length)
            params.push(`milestone_id=${options.milestoneIds.join(",")}`);
        if (options.limit)
            params.push(`limit=${options.limit}`);
        if (options.offset)
            params.push(`offset=${options.offset}`);
        if (params.length > 0) {
            endpoint += `&${params.join("&")}`;
        }
        const response = await this.makeRequest(endpoint);
        if (Array.isArray(response)) {
            return response;
        }
        else if (response && response.cases && Array.isArray(response.cases)) {
            return response.cases;
        }
        else {
            return [];
        }
    }
    async getCaseHistory(caseId, limit, offset) {
        let endpoint = `get_history_for_case/${caseId}`;
        const params = [];
        if (limit)
            params.push(`limit=${limit}`);
        if (offset)
            params.push(`offset=${offset}`);
        if (params.length > 0) {
            endpoint += `?${params.join("&")}`;
        }
        const response = await this.makeRequest(endpoint);
        return response.history || response;
    }
    async updateCasesBatch(suiteId, caseIds, updates) {
        return await this.makeRequest(`update_cases/${suiteId}`, {
            method: "POST",
            body: JSON.stringify({
                case_ids: caseIds,
                ...updates,
            }),
        });
    }
    async copyCasesToSection(targetSectionId, caseIds) {
        return await this.makeRequest(`copy_cases_to_section/${targetSectionId}`, {
            method: "POST",
            body: JSON.stringify({ case_ids: caseIds }),
        });
    }
    async moveCasesToSection(targetSectionId, targetSuiteId, caseIds) {
        return await this.makeRequest(`move_cases_to_section/${targetSectionId}`, {
            method: "POST",
            body: JSON.stringify({
                section_id: targetSectionId,
                suite_id: targetSuiteId,
                case_ids: caseIds,
            }),
        });
    }
}
//# sourceMappingURL=testrail-cases.js.map