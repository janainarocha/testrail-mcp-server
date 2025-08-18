import { TestRailBase, TestRailConfig } from "./testrail-base.js";
import { TestCase } from "./testrail-types.js";

export class TestRailCasesAPI extends TestRailBase {
	constructor(config: TestRailConfig) {
		super(config);
	}

	async getCase(caseId: number): Promise<TestCase> {
		return this.makeRequest<TestCase>(`get_case/${caseId}`);
	}

	async getCases(projectId: number, suiteId?: number, sectionId?: number): Promise<TestCase[]> {
		let endpoint = `get_cases/${projectId}`;
		const params = new URLSearchParams();
		if (suiteId) params.append("suite_id", suiteId.toString());
		if (sectionId) params.append("section_id", sectionId.toString());
		if (params.toString()) {
			endpoint += `&${params.toString()}`;
		}
		const response = await this.makeRequest<any>(endpoint);
		if (Array.isArray(response)) {
			return response;
		} else if (response && response.cases && Array.isArray(response.cases)) {
			return response.cases;
		} else {
			console.warn("Unexpected response format from TestRail API:", response);
			return [];
		}
	}

	async addCase(sectionId: number, testCase: Omit<TestCase, "id" | "section_id">): Promise<TestCase> {
		return this.makeRequest<TestCase>(`add_case/${sectionId}`, {
			method: "POST",
			body: JSON.stringify(testCase),
		});
	}

	async updateCase(caseId: number, testCase: Partial<TestCase>): Promise<TestCase> {
		return this.makeRequest<TestCase>(`update_case/${caseId}`, {
			method: "POST",
			body: JSON.stringify(testCase),
		});
	}

	async deleteCase(caseId: number): Promise<void> {
		await this.makeRequest<void>(`delete_case/${caseId}`, {
			method: "POST",
		});
	}

	async getCasesAdvanced(
		projectId: number,
		options: {
			suiteId?: number;
			sectionId?: number;
			filter?: string;
			priorityIds?: number[];
			typeIds?: number[];
			createdAfter?: Date;
			createdBefore?: Date;
			updatedAfter?: Date;
			updatedBefore?: Date;
			createdBy?: number[];
			updatedBy?: number[];
			templateIds?: number[];
			labelIds?: number[];
			refs?: string;
			milestoneIds?: number[];
			limit?: number;
			offset?: number;
		} = {}
	): Promise<any[]> {
		let endpoint = `get_cases/${projectId}`;
		const params: string[] = [];

		if (options.suiteId) params.push(`suite_id=${options.suiteId}`);
		if (options.sectionId) params.push(`section_id=${options.sectionId}`);
		if (options.filter) params.push(`filter=${encodeURIComponent(options.filter)}`);
		if (options.priorityIds?.length) params.push(`priority_id=${options.priorityIds.join(",")}`);
		if (options.typeIds?.length) params.push(`type_id=${options.typeIds.join(",")}`);
		if (options.createdAfter) params.push(`created_after=${Math.floor(options.createdAfter.getTime() / 1000)}`);
		if (options.createdBefore) params.push(`created_before=${Math.floor(options.createdBefore.getTime() / 1000)}`);
		if (options.updatedAfter) params.push(`updated_after=${Math.floor(options.updatedAfter.getTime() / 1000)}`);
		if (options.updatedBefore) params.push(`updated_before=${Math.floor(options.updatedBefore.getTime() / 1000)}`);
		if (options.createdBy?.length) params.push(`created_by=${options.createdBy.join(",")}`);
		if (options.updatedBy?.length) params.push(`updated_by=${options.updatedBy.join(",")}`);
		if (options.templateIds?.length) params.push(`template_id=${options.templateIds.join(",")}`);
		if (options.labelIds?.length) params.push(`label_id=${options.labelIds.join(",")}`);
		if (options.refs) params.push(`refs=${encodeURIComponent(options.refs)}`);
		if (options.milestoneIds?.length) params.push(`milestone_id=${options.milestoneIds.join(",")}`);
		if (options.limit) params.push(`limit=${options.limit}`);
		if (options.offset) params.push(`offset=${options.offset}`);

		if (params.length > 0) {
			endpoint += `&${params.join("&")}`;
		}

		const response: any = await this.makeRequest(endpoint);
		if (Array.isArray(response)) {
			return response;
		} else if (response && response.cases && Array.isArray(response.cases)) {
			return response.cases;
		} else {
			return [];
		}
	}

	async getCaseHistory(caseId: number, limit?: number, offset?: number): Promise<any[]> {
		let endpoint = `get_history_for_case/${caseId}`;
		const params: string[] = [];

		if (limit) params.push(`limit=${limit}`);
		if (offset) params.push(`offset=${offset}`);

		if (params.length > 0) {
			endpoint += `?${params.join("&")}`;
		}

		const response: any = await this.makeRequest(endpoint);
		return response.history || response;
	}

	async updateCasesBatch(suiteId: number, caseIds: number[], updates: Partial<TestCase>): Promise<any> {
		return await this.makeRequest(`update_cases/${suiteId}`, {
			method: "POST",
			body: JSON.stringify({
				case_ids: caseIds,
				...updates,
			}),
		});
	}

	async copyCasesToSection(targetSectionId: number, caseIds: number[]): Promise<any> {
		return await this.makeRequest(`copy_cases_to_section/${targetSectionId}`, {
			method: "POST",
			body: JSON.stringify({ case_ids: caseIds }),
		});
	}

	async moveCasesToSection(targetSectionId: number, targetSuiteId: number, caseIds: number[]): Promise<any> {
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
