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
export declare class TestRailSectionsAPI extends TestRailBase {
    constructor(config: TestRailConfig);
    /**
     * Get sections for a project and test suite
     * @param projectId The ID of the project
     * @param suiteId The ID of the test suite (optional for single suite mode)
     * @param options Optional filters and pagination
     * @returns Promise<SectionsResponse>
     */
    getSections(projectId: number, suiteId?: number, options?: GetSectionsOptions): Promise<SectionsResponse>;
    /**
     * Get a specific section
     * @param sectionId The ID of the section
     * @returns Promise<Section>
     */
    getSection(sectionId: number): Promise<Section>;
    /**
     * Create a new section
     * @param projectId The ID of the project
     * @param data The section data
     * @returns Promise<Section>
     */
    addSection(projectId: number, data: AddSectionData): Promise<Section>;
    /**
     * Update an existing section
     * @param sectionId The ID of the section
     * @param data The update data
     * @returns Promise<Section>
     */
    updateSection(sectionId: number, data: UpdateSectionData): Promise<Section>;
    /**
     * Move a section to another suite or section
     * @param sectionId The ID of the section
     * @param data The move data
     * @returns Promise<Section>
     */
    moveSection(sectionId: number, data: MoveSectionData): Promise<Section>;
    /**
     * Delete an existing section
     * @param sectionId The ID of the section
     * @param soft Whether to perform a soft delete (preview only)
     * @returns Promise<DeleteSectionResponse>
     */
    deleteSection(sectionId: number, soft?: boolean): Promise<DeleteSectionResponse>;
}
