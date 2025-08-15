import { z } from "zod";

/**
 * TestRail API client for making HTTP requests to TestRail REST API v2
 */
export interface TestRailConfig {
	baseUrl: string;
	username: string;
	apiKey: string;
}

export interface TestCase {
	id?: number;
	title: string;
	section_id: number;
	template_id?: number;
	type_id?: number;
	priority_id?: number;
	estimate?: string;
	milestone_id?: number;
	refs?: string;
	custom_preconds?: string;
	custom_steps?: string;
	custom_expected?: string;
	custom_steps_separated?: Array<{
		content: string;
		expected: string;
	}>;
	custom_mission?: string;
	custom_goals?: string;
}

export interface Project {
	id: number;
	name: string;
	announcement?: string;
	show_announcement?: boolean;
	is_completed?: boolean;
	completed_on?: number;
	suite_mode?: number;
	default_role_id?: number;
}

export interface Section {
	id: number;
	name: string;
	description?: string;
	suite_id?: number;
	parent_id?: number;
	display_order?: number;
}

export interface Suite {
	id: number;
	name: string;
	description?: string;
	project_id: number;
	is_master?: boolean;
	is_baseline?: boolean;
	is_completed?: boolean;
	completed_on?: number;
}

export interface CaseType {
	id: number;
	name: string;
	is_default?: boolean;
}

export interface Priority {
	id: number;
	name: string;
	short_name?: string;
	is_default?: boolean;
}

export class TestRailAPI {
	private baseUrl: string;
	private auth: string;

	constructor(config: TestRailConfig) {
		// Remove trailing slash and ensure proper format
		this.baseUrl = config.baseUrl.replace(/\/$/, "");

		// Create base64 encoded auth header
		this.auth = Buffer.from(`${config.username}:${config.apiKey}`).toString("base64");
	}

	/**
	 * Make HTTP request to TestRail API
	 */
	private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const url = `${this.baseUrl}/index.php?/api/v2/${endpoint}`;

		const headers = {
			Authorization: `Basic ${this.auth}`,
			"Content-Type": "application/json",
			...options.headers,
		};

		try {
			const response = await fetch(url, {
				...options,
				headers,
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`TestRail API error (${response.status}): ${errorText}`);
			}

			return (await response.json()) as T;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`TestRail API request failed: ${error.message}`);
			}
			throw error;
		}
	}

	/**
	 * Get all projects
	 */
	async getProjects(): Promise<Project[]> {
		const response = await this.makeRequest<{ projects: Project[] }>("get_projects");
		return response.projects || [];
	}

	/**
	 * Get project by ID
	 */
	async getProject(projectId: number): Promise<Project> {
		return this.makeRequest<Project>(`get_project/${projectId}`);
	}

	/**
	 * Get suites for a project
	 */
	async getSuites(projectId: number): Promise<Suite[]> {
		const response = await this.makeRequest<{ suites: Suite[] }>(`get_suites/${projectId}`);
		return response.suites;
	}

	/**
	 * Get sections for a project/suite
	 */
	async getSections(projectId: number, suiteId?: number): Promise<Section[]> {
		const endpoint = suiteId ? `get_sections/${projectId}&suite_id=${suiteId}` : `get_sections/${projectId}`;
		const response = await this.makeRequest<{ sections: Section[] }>(endpoint);
		return response.sections;
	}

	/**
	 * Get case types
	 */
	async getCaseTypes(): Promise<CaseType[]> {
		return this.makeRequest<CaseType[]>("get_case_types");
	}

	/**
	 * Get priorities
	 */
	async getPriorities(): Promise<Priority[]> {
		return this.makeRequest<Priority[]>("get_priorities");
	}

	/**
	 * Get test case by ID
	 */
	async getCase(caseId: number): Promise<TestCase> {
		return this.makeRequest<TestCase>(`get_case/${caseId}`);
	}

	/**
	 * Get test cases for a project/suite/section
	 */
	async getCases(projectId: number, suiteId?: number, sectionId?: number): Promise<TestCase[]> {
		let endpoint = `get_cases/${projectId}`;
		const params = new URLSearchParams();

		if (suiteId) params.append("suite_id", suiteId.toString());
		if (sectionId) params.append("section_id", sectionId.toString());

		if (params.toString()) {
			endpoint += `&${params.toString()}`;
		}

		const response = await this.makeRequest<{ cases: TestCase[] }>(endpoint);
		return response.cases || [];
	}

	/**
	 * Create a new test case
	 */
	async addCase(sectionId: number, testCase: Omit<TestCase, "id" | "section_id">): Promise<TestCase> {
		return this.makeRequest<TestCase>(`add_case/${sectionId}`, {
			method: "POST",
			body: JSON.stringify(testCase),
		});
	}

	/**
	 * Update an existing test case
	 */
	async updateCase(caseId: number, testCase: Partial<TestCase>): Promise<TestCase> {
		return this.makeRequest<TestCase>(`update_case/${caseId}`, {
			method: "POST",
			body: JSON.stringify(testCase),
		});
	}

	/**
	 * Delete a test case
	 */
	async deleteCase(caseId: number): Promise<void> {
		await this.makeRequest<void>(`delete_case/${caseId}`, {
			method: "POST",
		});
	}

	/**
	 * Add section to a project/suite (legacy method)
	 */
	async addSectionLegacy(projectId: number, name: string, suiteId?: number, parentId?: number): Promise<Section> {
		const sectionData: any = {
			name,
			suite_id: suiteId,
			parent_id: parentId,
		};

		const endpoint = suiteId ? `add_section/${projectId}` : `add_section/${projectId}`;

		return this.makeRequest<Section>(endpoint, {
			method: "POST",
			body: JSON.stringify(sectionData),
		});
	}

	/**
	 * Get cases with advanced filtering
	 */
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
		if (options.limit) params.push(`limit=${options.limit}`);
		if (options.offset) params.push(`offset=${options.offset}`);

		if (params.length > 0) {
			endpoint += `?${params.join("&")}`;
		}

		const response: any = await this.makeRequest(endpoint);
		return response.cases || response;
	}

	/**
	 * Get case history (changes/audit trail)
	 */
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

	/**
	 * Copy cases to another section
	 */
	async copyCasesToSection(targetSectionId: number, caseIds: number[]): Promise<any> {
		return await this.makeRequest(`copy_cases_to_section/${targetSectionId}`, {
			method: "POST",
			body: JSON.stringify({ case_ids: caseIds }),
		});
	}

	/**
	 * Move cases to another section
	 */
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

	/**
	 * Update multiple cases with same values
	 */
	async updateCasesBatch(suiteId: number, caseIds: number[], updates: Partial<TestCase>): Promise<any> {
		return await this.makeRequest(`update_cases/${suiteId}`, {
			method: "POST",
			body: JSON.stringify({
				case_ids: caseIds,
				...updates,
			}),
		});
	}

	/**
	 * Get available case fields (custom fields)
	 */
	async getCaseFields(): Promise<any[]> {
		return await this.makeRequest("get_case_fields");
	}

	/**
	 * Get attachments for a case
	 */
	async getAttachmentsForCase(caseId: number, limit?: number, offset?: number): Promise<any[]> {
		let endpoint = `get_attachments_for_case/${caseId}`;
		const params: string[] = [];

		if (limit) params.push(`limit=${limit}`);
		if (offset) params.push(`offset=${offset}`);

		if (params.length > 0) {
			endpoint += `?${params.join("&")}`;
		}

		const response: any = await this.makeRequest(endpoint);
		return response.attachments || response;
	}

	/**
	 * Delete attachment
	 */
	async deleteAttachment(attachmentId: string): Promise<void> {
		await this.makeRequest(`delete_attachment/${attachmentId}`, {
			method: "POST",
		});
	}

	/**
	 * Get milestones for a project
	 */
	async getMilestones(
		projectId: number,
		options: {
			isCompleted?: boolean;
			isStarted?: boolean;
			limit?: number;
			offset?: number;
		} = {}
	): Promise<any[]> {
		let endpoint = `get_milestones/${projectId}`;
		const params: string[] = [];

		if (options.isCompleted !== undefined) params.push(`is_completed=${options.isCompleted ? 1 : 0}`);
		if (options.isStarted !== undefined) params.push(`is_started=${options.isStarted ? 1 : 0}`);
		if (options.limit) params.push(`limit=${options.limit}`);
		if (options.offset) params.push(`offset=${options.offset}`);

		if (params.length > 0) {
			endpoint += `?${params.join("&")}`;
		}

		const response: any = await this.makeRequest(endpoint);
		return response.milestones || response;
	}

	/**
	 * Get milestone details
	 */
	async getMilestone(milestoneId: number): Promise<any> {
		return await this.makeRequest(`get_milestone/${milestoneId}`);
	}

	/**
	 * Add new milestone
	 */
	async addMilestone(
		projectId: number,
		milestone: {
			name: string;
			description?: string;
			dueOn?: Date;
			startOn?: Date;
			parentId?: number;
			refs?: string;
		}
	): Promise<any> {
		const milestoneData: any = {
			name: milestone.name,
			description: milestone.description,
			parent_id: milestone.parentId,
			refs: milestone.refs,
		};

		if (milestone.dueOn) {
			milestoneData.due_on = Math.floor(milestone.dueOn.getTime() / 1000);
		}
		if (milestone.startOn) {
			milestoneData.start_on = Math.floor(milestone.startOn.getTime() / 1000);
		}

		return await this.makeRequest(`add_milestone/${projectId}`, {
			method: "POST",
			body: JSON.stringify(milestoneData),
		});
	}

	/**
	 * Update milestone
	 */
	async updateMilestone(
		milestoneId: number,
		updates: {
			name?: string;
			description?: string;
			isCompleted?: boolean;
			isStarted?: boolean;
			dueOn?: Date;
			startOn?: Date;
		}
	): Promise<any> {
		const updateData: any = {};

		if (updates.name) updateData.name = updates.name;
		if (updates.description) updateData.description = updates.description;
		if (updates.isCompleted !== undefined) updateData.is_completed = updates.isCompleted;
		if (updates.isStarted !== undefined) updateData.is_started = updates.isStarted;
		if (updates.dueOn) updateData.due_on = Math.floor(updates.dueOn.getTime() / 1000);
		if (updates.startOn) updateData.start_on = Math.floor(updates.startOn.getTime() / 1000);

		return await this.makeRequest(`update_milestone/${milestoneId}`, {
			method: "POST",
			body: JSON.stringify(updateData),
		});
	}

	/**
	 * Delete milestone
	 */
	async deleteMilestone(milestoneId: number): Promise<void> {
		await this.makeRequest(`delete_milestone/${milestoneId}`, {
			method: "POST",
		});
	}

	/**
	 * Get labels for a project
	 */
	async getLabels(projectId: number, limit?: number, offset?: number): Promise<any[]> {
		let endpoint = `get_labels/${projectId}`;
		const params: string[] = [];

		if (limit) params.push(`limit=${limit}`);
		if (offset) params.push(`offset=${offset}`);

		if (params.length > 0) {
			endpoint += `?${params.join("&")}`;
		}

		const response: any = await this.makeRequest(endpoint);
		return response.labels || response;
	}

	/**
	 * Get label details
	 */
	async getLabel(labelId: number): Promise<any> {
		return await this.makeRequest(`get_label/${labelId}`);
	}

	/**
	 * Get user groups
	 */
	async getGroups(): Promise<any[]> {
		const response: any = await this.makeRequest("get_groups");
		return response.groups || response;
	}

	/**
	 * Get group details
	 */
	async getGroup(groupId: number): Promise<any> {
		return await this.makeRequest(`get_group/${groupId}`);
	}

	/**
	 * Add new project (admin only)
	 */
	async addProject(project: { name: string; announcement?: string; showAnnouncement?: boolean; suiteMode?: number }): Promise<any> {
		const projectData: any = {
			name: project.name,
			announcement: project.announcement,
			show_announcement: project.showAnnouncement,
			suite_mode: project.suiteMode || 1,
		};

		return await this.makeRequest("add_project", {
			method: "POST",
			body: JSON.stringify(projectData),
		});
	}

	/**
	 * Update project (admin only)
	 */
	async updateProject(
		projectId: number,
		updates: {
			name?: string;
			announcement?: string;
			showAnnouncement?: boolean;
			isCompleted?: boolean;
		}
	): Promise<any> {
		const updateData: any = {};

		if (updates.name) updateData.name = updates.name;
		if (updates.announcement) updateData.announcement = updates.announcement;
		if (updates.showAnnouncement !== undefined) updateData.show_announcement = updates.showAnnouncement;
		if (updates.isCompleted !== undefined) updateData.is_completed = updates.isCompleted;

		return await this.makeRequest(`update_project/${projectId}`, {
			method: "POST",
			body: JSON.stringify(updateData),
		});
	}

	/**
	 * Delete project (admin only)
	 */
	async deleteProject(projectId: number): Promise<void> {
		await this.makeRequest(`delete_project/${projectId}`, {
			method: "POST",
		});
	}

	// ========== TEST RUNS API ==========
	/**
	 * Get test run details
	 * @param runId - Test run ID
	 */
	async getRun(runId: number): Promise<any> {
		return this.makeRequest(`get_run/${runId}`, { method: "GET" });
	}

	/**
	 * Get test runs for a project
	 * @param projectId - Project ID
	 * @param filters - Optional filters (is_completed, created_by, milestone_id, etc.)
	 */
	async getRuns(
		projectId: number,
		filters?: {
			isCompleted?: boolean;
			createdBy?: number[];
			milestoneId?: number[];
			suiteId?: number[];
			createdAfter?: Date;
			createdBefore?: Date;
			limit?: number;
			offset?: number;
		}
	): Promise<any> {
		const params = new URLSearchParams();

		if (filters?.isCompleted !== undefined) {
			params.append("is_completed", filters.isCompleted ? "1" : "0");
		}
		if (filters?.createdBy?.length) {
			params.append("created_by", filters.createdBy.join(","));
		}
		if (filters?.milestoneId?.length) {
			params.append("milestone_id", filters.milestoneId.join(","));
		}
		if (filters?.suiteId?.length) {
			params.append("suite_id", filters.suiteId.join(","));
		}
		if (filters?.createdAfter) {
			params.append("created_after", Math.floor(filters.createdAfter.getTime() / 1000).toString());
		}
		if (filters?.createdBefore) {
			params.append("created_before", Math.floor(filters.createdBefore.getTime() / 1000).toString());
		}
		if (filters?.limit) {
			params.append("limit", filters.limit.toString());
		}
		if (filters?.offset) {
			params.append("offset", filters.offset.toString());
		}

		const query = params.toString();
		const endpoint = query ? `get_runs/${projectId}&${query}` : `get_runs/${projectId}`;
		return this.makeRequest(endpoint, { method: "GET" });
	}

	/**
	 * Create a new test run
	 * @param projectId - Project ID
	 * @param runData - Test run data
	 */
	async addRun(
		projectId: number,
		runData: {
			suiteId?: number;
			name: string;
			description?: string;
			milestoneId?: number;
			assignedtoId?: number;
			includeAll?: boolean;
			caseIds?: number[];
			refs?: string;
			startOn?: Date;
			dueOn?: Date;
		}
	): Promise<any> {
		const payload: any = {
			name: runData.name,
			suite_id: runData.suiteId,
			description: runData.description,
			milestone_id: runData.milestoneId,
			assignedto_id: runData.assignedtoId,
			include_all: runData.includeAll ?? true,
			case_ids: runData.caseIds,
			refs: runData.refs,
		};

		if (runData.startOn) {
			payload.start_on = Math.floor(runData.startOn.getTime() / 1000);
		}
		if (runData.dueOn) {
			payload.due_on = Math.floor(runData.dueOn.getTime() / 1000);
		}

		return this.makeRequest(`add_run/${projectId}`, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}

	/**
	 * Update an existing test run
	 * @param runId - Test run ID
	 * @param updates - Fields to update
	 */
	async updateRun(
		runId: number,
		updates: {
			name?: string;
			description?: string;
			milestoneId?: number;
			includeAll?: boolean;
			caseIds?: number[];
			refs?: string;
			startOn?: Date;
			dueOn?: Date;
		}
	): Promise<any> {
		const payload: any = {
			name: updates.name,
			description: updates.description,
			milestone_id: updates.milestoneId,
			include_all: updates.includeAll,
			case_ids: updates.caseIds,
			refs: updates.refs,
		};

		if (updates.startOn) {
			payload.start_on = Math.floor(updates.startOn.getTime() / 1000);
		}
		if (updates.dueOn) {
			payload.due_on = Math.floor(updates.dueOn.getTime() / 1000);
		}

		return this.makeRequest(`update_run/${runId}`, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}

	/**
	 * Close a test run (archive)
	 * @param runId - Test run ID
	 */
	async closeRun(runId: number): Promise<any> {
		return this.makeRequest(`close_run/${runId}`, { method: "POST" });
	}

	/**
	 * Delete a test run
	 * @param runId - Test run ID
	 * @param soft - If true, return impact data without actually deleting
	 */
	async deleteRun(runId: number, soft: boolean = false): Promise<any> {
		const payload = soft ? { soft: 1 } : {};
		return this.makeRequest(`delete_run/${runId}`, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}

	// ========== SHARED STEPS API ==========
	/**
	 * Get shared step details
	 * @param sharedStepId - Shared step ID
	 */
	async getSharedStep(sharedStepId: number): Promise<any> {
		return this.makeRequest(`get_shared_step/${sharedStepId}`, { method: "GET" });
	}

	/**
	 * Get shared steps for a project
	 * @param projectId - Project ID
	 * @param filters - Optional filters
	 */
	async getSharedSteps(
		projectId: number,
		filters?: {
			createdAfter?: Date;
			createdBefore?: Date;
			createdBy?: number[];
			updatedAfter?: Date;
			updatedBefore?: Date;
			refs?: string;
			limit?: number;
			offset?: number;
		}
	): Promise<any> {
		const params = new URLSearchParams();

		if (filters?.createdAfter) {
			params.append("created_after", Math.floor(filters.createdAfter.getTime() / 1000).toString());
		}
		if (filters?.createdBefore) {
			params.append("created_before", Math.floor(filters.createdBefore.getTime() / 1000).toString());
		}
		if (filters?.createdBy?.length) {
			params.append("created_by", filters.createdBy.join(","));
		}
		if (filters?.updatedAfter) {
			params.append("updated_after", Math.floor(filters.updatedAfter.getTime() / 1000).toString());
		}
		if (filters?.updatedBefore) {
			params.append("updated_before", Math.floor(filters.updatedBefore.getTime() / 1000).toString());
		}
		if (filters?.refs) {
			params.append("refs", filters.refs);
		}
		if (filters?.limit) {
			params.append("limit", filters.limit.toString());
		}
		if (filters?.offset) {
			params.append("offset", filters.offset.toString());
		}

		const query = params.toString();
		const endpoint = query ? `get_shared_steps/${projectId}&${query}` : `get_shared_steps/${projectId}`;
		return this.makeRequest(endpoint, { method: "GET" });
	}

	/**
	 * Get shared step change history
	 * @param sharedStepId - Shared step ID
	 */
	async getSharedStepHistory(sharedStepId: number): Promise<any> {
		return this.makeRequest(`get_shared_step_history/${sharedStepId}`, { method: "GET" });
	}

	/**
	 * Create new shared steps
	 * @param projectId - Project ID
	 * @param sharedStepData - Shared step data
	 */
	async addSharedStep(
		projectId: number,
		sharedStepData: {
			title: string;
			steps: Array<{
				content?: string;
				expected?: string;
				additionalInfo?: string;
				refs?: string;
			}>;
		}
	): Promise<any> {
		const payload = {
			title: sharedStepData.title,
			custom_steps_separated: sharedStepData.steps.map((step) => ({
				content: step.content,
				expected: step.expected,
				additional_info: step.additionalInfo,
				refs: step.refs,
			})),
		};

		return this.makeRequest(`add_shared_step/${projectId}`, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}

	/**
	 * Update existing shared steps
	 * @param sharedStepId - Shared step ID
	 * @param updates - Fields to update
	 */
	async updateSharedStep(
		sharedStepId: number,
		updates: {
			title?: string;
			steps?: Array<{
				content?: string;
				expected?: string;
				additionalInfo?: string;
				refs?: string;
			}>;
		}
	): Promise<any> {
		const payload: any = {};

		if (updates.title) {
			payload.title = updates.title;
		}
		if (updates.steps) {
			payload.custom_steps_separated = updates.steps.map((step) => ({
				content: step.content,
				expected: step.expected,
				additional_info: step.additionalInfo,
				refs: step.refs,
			}));
		}

		return this.makeRequest(`update_shared_step/${sharedStepId}`, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}

	/**
	 * Delete shared steps
	 * @param sharedStepId - Shared step ID
	 * @param keepInCases - Keep steps in test cases (default: true)
	 */
	async deleteSharedStep(sharedStepId: number, keepInCases: boolean = true): Promise<any> {
		const payload = { keep_in_cases: keepInCases ? 1 : 0 };
		return this.makeRequest(`delete_shared_step/${sharedStepId}`, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}

	// ========== RESULT FIELDS API ==========
	/**
	 * Get available result fields
	 */
	async getResultFields(): Promise<any> {
		return this.makeRequest("get_result_fields", { method: "GET" });
	}

	// ========== ROLES API ==========
	/**
	 * Get available user roles
	 */
	async getRoles(): Promise<any> {
		return this.makeRequest("get_roles", { method: "GET" });
	}

	// ========== STATUSES API ==========
	/**
	 * Get test result statuses
	 */
	async getStatuses(): Promise<any> {
		return this.makeRequest("get_statuses", { method: "GET" });
	}

	/**
	 * Get test case statuses (Enterprise 7.3+)
	 */
	async getCaseStatuses(): Promise<any> {
		return this.makeRequest("get_case_statuses", { method: "GET" });
	}

	// ========== SUITES API ==========
	/**
	 * Get test suite details
	 * @param suiteId - Suite ID
	 */
	async getSuite(suiteId: number): Promise<any> {
		return this.makeRequest(`get_suite/${suiteId}`, { method: "GET" });
	}

	/**
	 * Create a new test suite
	 * @param projectId - Project ID
	 * @param suiteData - Suite data
	 */
	async addSuite(
		projectId: number,
		suiteData: {
			name: string;
			description?: string;
		}
	): Promise<any> {
		return this.makeRequest(`add_suite/${projectId}`, {
			method: "POST",
			body: JSON.stringify(suiteData),
		});
	}

	/**
	 * Update an existing test suite
	 * @param suiteId - Suite ID
	 * @param updates - Fields to update
	 */
	async updateSuite(
		suiteId: number,
		updates: {
			name?: string;
			description?: string;
		}
	): Promise<any> {
		return this.makeRequest(`update_suite/${suiteId}`, {
			method: "POST",
			body: JSON.stringify(updates),
		});
	}

	/**
	 * Delete a test suite
	 * @param suiteId - Suite ID
	 * @param soft - If true, return impact data without actually deleting
	 */
	async deleteSuite(suiteId: number, soft: boolean = false): Promise<any> {
		const payload = soft ? { soft: 1 } : {};
		return this.makeRequest(`delete_suite/${suiteId}`, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}

	// ========== SECTIONS API (Enhanced) ==========
	/**
	 * Get section details
	 * @param sectionId - Section ID
	 */
	async getSection(sectionId: number): Promise<any> {
		return this.makeRequest(`get_section/${sectionId}`, { method: "GET" });
	}

	/**
	 * Move a section to another suite or parent
	 * @param sectionId - Section ID
	 * @param moveData - Move parameters
	 */
	async moveSection(
		sectionId: number,
		moveData: {
			parentId?: number;
			afterId?: number;
		}
	): Promise<any> {
		return this.makeRequest(`move_section/${sectionId}`, {
			method: "POST",
			body: JSON.stringify(moveData),
		});
	}

	/**
	 * Update an existing section
	 * @param sectionId - Section ID
	 * @param updates - Fields to update
	 */
	async updateSection(
		sectionId: number,
		updates: {
			name?: string;
			description?: string;
		}
	): Promise<any> {
		return this.makeRequest(`update_section/${sectionId}`, {
			method: "POST",
			body: JSON.stringify(updates),
		});
	}

	/**
	 * Delete a section
	 * @param sectionId - Section ID
	 * @param soft - If true, return impact data without actually deleting
	 */
	async deleteSection(sectionId: number, soft: boolean = false): Promise<any> {
		const payload = soft ? { soft: 1 } : {};
		return this.makeRequest(`delete_section/${sectionId}`, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}

	// ========== TEMPLATES API ==========
	/**
	 * Get available templates (field layouts) for a project
	 * @param projectId - Project ID
	 */
	async getTemplates(projectId: number): Promise<any> {
		return this.makeRequest(`get_templates/${projectId}`, { method: "GET" });
	}

	// ========== TESTS API (Individual Test Instances) ==========
	/**
	 * Get test instance details
	 * @param testId - Test instance ID
	 */
	async getTest(testId: number): Promise<any> {
		return this.makeRequest(`get_test/${testId}`, { method: "GET" });
	}

	/**
	 * Get tests for a test run
	 * @param runId - Test run ID
	 * @param filters - Optional filters
	 */
	async getTests(
		runId: number,
		filters?: {
			statusId?: number[];
			labelId?: number[];
			limit?: number;
			offset?: number;
		}
	): Promise<any> {
		const params = new URLSearchParams();

		if (filters?.statusId?.length) {
			params.append("status_id", filters.statusId.join(","));
		}
		if (filters?.labelId?.length) {
			params.append("label_id", filters.labelId.join(","));
		}
		if (filters?.limit) {
			params.append("limit", filters.limit.toString());
		}
		if (filters?.offset) {
			params.append("offset", filters.offset.toString());
		}

		const query = params.toString();
		const endpoint = query ? `get_tests/${runId}&${query}` : `get_tests/${runId}`;
		return this.makeRequest(endpoint, { method: "GET" });
	}

	/**
	 * Update test labels
	 * @param testId - Test instance ID
	 * @param labels - Array of label IDs or titles
	 */
	async updateTest(testId: number, labels: (number | string)[]): Promise<any> {
		return this.makeRequest(`update_test/${testId}`, {
			method: "POST",
			body: JSON.stringify({ labels }),
		});
	}

	/**
	 * Update multiple tests with same labels
	 * @param testIds - Array of test instance IDs
	 * @param labels - Array of label IDs or titles
	 */
	async updateTests(testIds: number[], labels: (number | string)[]): Promise<any> {
		return this.makeRequest("update_tests", {
			method: "POST",
			body: JSON.stringify({
				test_ids: testIds,
				labels,
			}),
		});
	}

	// ========== USERS API ==========
	/**
	 * Get user details
	 * @param userId - User ID
	 */
	async getUser(userId: number): Promise<any> {
		return this.makeRequest(`get_user/${userId}`, { method: "GET" });
	}

	/**
	 * Get current user details
	 */
	async getCurrentUser(): Promise<any> {
		return this.makeRequest("get_current_user", { method: "GET" });
	}

	/**
	 * Get user by email address
	 * @param email - User email address
	 */
	async getUserByEmail(email: string): Promise<any> {
		return this.makeRequest(`get_user_by_email&email=${encodeURIComponent(email)}`, { method: "GET" });
	}

	/**
	 * Get users list
	 * @param projectId - Optional project ID (required for non-admins)
	 */
	async getUsers(projectId?: number): Promise<any> {
		const endpoint = projectId ? `get_users/${projectId}` : "get_users";
		return this.makeRequest(endpoint, { method: "GET" });
	}

	/**
	 * Create a new user (requires TestRail 7.3+)
	 * @param userData - User data
	 */
	async addUser(userData: { name: string; email: string; isActive?: boolean; isAdmin?: boolean; roleId?: number; groupIds?: number[]; assignedProjects?: number[]; emailNotifications?: boolean; mfaRequired?: boolean; ssoEnabled?: boolean }): Promise<any> {
		const payload = {
			name: userData.name,
			email: userData.email,
			is_active: userData.isActive,
			is_admin: userData.isAdmin,
			role_id: userData.roleId,
			group_ids: userData.groupIds,
			assigned_projects: userData.assignedProjects,
			email_notifications: userData.emailNotifications,
			mfa_required: userData.mfaRequired,
			sso_enabled: userData.ssoEnabled,
		};

		return this.makeRequest("add_user", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}

	/**
	 * Update an existing user
	 * @param userId - User ID
	 * @param updates - Fields to update
	 */
	async updateUser(
		userId: number,
		updates: {
			name?: string;
			email?: string;
			isActive?: boolean;
			isAdmin?: boolean;
			roleId?: number;
			groupIds?: number[];
			assignedProjects?: number[];
			emailNotifications?: boolean;
			mfaRequired?: boolean;
			ssoEnabled?: boolean;
		}
	): Promise<any> {
		const payload = {
			name: updates.name,
			email: updates.email,
			is_active: updates.isActive,
			is_admin: updates.isAdmin,
			role_id: updates.roleId,
			group_ids: updates.groupIds,
			assigned_projects: updates.assignedProjects,
			email_notifications: updates.emailNotifications,
			mfa_required: updates.mfaRequired,
			sso_enabled: updates.ssoEnabled,
		};

		return this.makeRequest(`update_user/${userId}`, {
			method: "POST",
			body: JSON.stringify(payload),
		});
	}

	// ========== VARIABLES API (Enterprise) ==========
	/**
	 * Get variables for a project
	 * @param projectId - Project ID
	 */
	async getVariables(projectId: number): Promise<any> {
		return this.makeRequest(`get_variables/${projectId}`, { method: "GET" });
	}

	/**
	 * Create a new variable
	 * @param projectId - Project ID
	 * @param variableData - Variable data
	 */
	async addVariable(
		projectId: number,
		variableData: {
			name: string;
		}
	): Promise<any> {
		return this.makeRequest(`add_variable/${projectId}`, {
			method: "POST",
			body: JSON.stringify(variableData),
		});
	}

	/**
	 * Update an existing variable
	 * @param variableId - Variable ID
	 * @param updates - Fields to update
	 */
	async updateVariable(
		variableId: number,
		updates: {
			name: string;
		}
	): Promise<any> {
		return this.makeRequest(`update_variable/${variableId}`, {
			method: "POST",
			body: JSON.stringify(updates),
		});
	}

	/**
	 * Delete a variable
	 * @param variableId - Variable ID
	 */
	async deleteVariable(variableId: number): Promise<any> {
		return this.makeRequest(`delete_variable/${variableId}`, { method: "POST" });
	}
}
