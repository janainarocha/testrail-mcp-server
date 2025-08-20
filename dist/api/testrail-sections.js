import { TestRailBase } from "./testrail-base.js";
export class TestRailSectionsAPI extends TestRailBase {
    constructor(config) {
        super(config);
    }
    /**
     * Get sections for a project and test suite
     * @param projectId The ID of the project
     * @param suiteId The ID of the test suite (optional for single suite mode)
     * @param options Optional filters and pagination
     * @returns Promise<SectionsResponse>
     */
    async getSections(projectId, suiteId, options) {
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
        return this.makeRequest(endpoint);
    }
    /**
     * Get a specific section
     * @param sectionId The ID of the section
     * @returns Promise<Section>
     */
    async getSection(sectionId) {
        return this.makeRequest(`get_section/${sectionId}`);
    }
    /**
     * Create a new section
     * @param projectId The ID of the project
     * @param data The section data
     * @returns Promise<Section>
     */
    async addSection(projectId, data) {
        const endpoint = `add_section/${projectId}`;
        return this.makeRequest(endpoint, {
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
    async updateSection(sectionId, data) {
        const endpoint = `update_section/${sectionId}`;
        return this.makeRequest(endpoint, {
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
    async moveSection(sectionId, data) {
        const endpoint = `move_section/${sectionId}`;
        return this.makeRequest(endpoint, {
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
    async deleteSection(sectionId, soft) {
        const params = new URLSearchParams();
        if (soft !== undefined) {
            params.append('soft', soft ? '1' : '0');
        }
        const queryString = params.toString();
        const endpoint = `delete_section/${sectionId}${queryString ? '?' + queryString : ''}`;
        return this.makeRequest(endpoint, {
            method: "POST",
        });
    }
}
//# sourceMappingURL=testrail-sections.js.map