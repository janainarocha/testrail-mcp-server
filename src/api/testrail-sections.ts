import { TestRailBase, TestRailConfig } from "./testrail-base.js";
import { Section } from "./testrail-types.js";

/**
 * Sections Response interface
 */
export interface SectionsResponse {
	offset: number;
	limit: number;
	size: number;
	_links: {
		next?: string;
		prev?: string;
	};
	sections: Section[];
}

/**
 * Get Sections Options interface
 */
export interface GetSectionsOptions {
	limit?: number;
	offset?: number;
}

/**
 * Add Section Data interface
 */
export interface AddSectionData {
	description?: string;
	suite_id?: number;
	parent_id?: number;
	name: string;
}

/**
 * Update Section Data interface
 */
export interface UpdateSectionData {
	description?: string;
	name?: string;
}

/**
 * Move Section Data interface
 */
export interface MoveSectionData {
	parent_id?: number;
	after_id?: number;
}

/**
 * Delete Section Response interface
 */
export interface DeleteSectionResponse {
	success: boolean;
	message?: string;
}

export class TestRailSectionsAPI extends TestRailBase {
	constructor(config: TestRailConfig) {
		super(config);
	}

	/**
	 * Get sections for a project and test suite
	 * @param projectId The ID of the project
	 * @param suiteId The ID of the test suite (optional for single suite mode)
	 * @param options Optional filters and pagination
	 * @returns Promise<SectionsResponse>
	 */
	async getSections(projectId: number, suiteId?: number, options?: GetSectionsOptions): Promise<SectionsResponse> {
		const params = new URLSearchParams();
		
		if (suiteId) {
			params.append('suite_id', suiteId.toString());
		}
		if (options?.limit) {
			params.append('limit', options.limit.toString());
		}
		if (options?.offset) {
			params.append('offset', options.offset.toString());
		}

		const queryString = params.toString();
		const endpoint = `get_sections/${projectId}${queryString ? '&' + queryString : ''}`;
		
		return this.makeRequest<SectionsResponse>(endpoint);
	}

	/**
	 * Get a specific section
	 * @param sectionId The ID of the section
	 * @returns Promise<Section>
	 */
	async getSection(sectionId: number): Promise<Section> {
		return this.makeRequest<Section>(`get_section/${sectionId}`);
	}

	/**
	 * Create a new section
	 * @param projectId The ID of the project
	 * @param data The section data
	 * @returns Promise<Section>
	 */
	async addSection(projectId: number, data: AddSectionData): Promise<Section> {
		const endpoint = `add_section/${projectId}`;
		return this.makeRequest<Section>(endpoint, {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	/**
	 * Update an existing section
	 * @param sectionId The ID of the section
	 * @param data The update data
	 * @returns Promise<Section>
	 */
	async updateSection(sectionId: number, data: UpdateSectionData): Promise<Section> {
		const endpoint = `update_section/${sectionId}`;
		return this.makeRequest<Section>(endpoint, {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	/**
	 * Move a section to another suite or section
	 * @param sectionId The ID of the section
	 * @param data The move data
	 * @returns Promise<Section>
	 */
	async moveSection(sectionId: number, data: MoveSectionData): Promise<Section> {
		const endpoint = `move_section/${sectionId}`;
		return this.makeRequest<Section>(endpoint, {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	/**
	 * Delete an existing section
	 * @param sectionId The ID of the section
	 * @param soft Whether to perform a soft delete (preview only)
	 * @returns Promise<DeleteSectionResponse>
	 */
	async deleteSection(sectionId: number, soft?: boolean): Promise<DeleteSectionResponse> {
		const params = new URLSearchParams();
		if (soft !== undefined) {
			params.append('soft', soft ? '1' : '0');
		}

		const queryString = params.toString();
		const endpoint = `delete_section/${sectionId}${queryString ? '?' + queryString : ''}`;
		
		return this.makeRequest<DeleteSectionResponse>(endpoint, {
			method: "POST",
		});
	}
}
