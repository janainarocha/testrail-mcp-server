import { z } from "zod";
/**
 * Section Tools
 * Tools for managing test sections in TestRail.
 */
export function registerSectionTools(server, clients) {
    /**
     * Get a specific section
     */
    server.registerTool("testrail_get_section", {
        description: "Get a specific section by ID with complete details including hierarchy information",
        inputSchema: {
            section_id: z.number().positive().describe("The ID of the section")
        },
    }, async ({ section_id }) => {
        try {
            const section = await clients.sections.getSection(section_id);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(section, null, 2)
                    }
                ]
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: error instanceof Error ? error.message : "Unknown error",
                            section_id,
                            details: "Failed to get section"
                        }, null, 2)
                    }
                ]
            };
        }
    });
    /**
     * Get sections for a project and test suite
     */
    server.registerTool("testrail_get_sections", {
        description: "Get sections for a project and test suite with optional pagination - shows hierarchy structure",
        inputSchema: {
            project_id: z.number().positive().describe("The ID of the project"),
            suite_id: z.number().positive().optional().describe("The ID of the test suite (optional for single suite mode)"),
            limit: z.number().positive().max(250).optional().describe("The number of sections to return (max 250)"),
            offset: z.number().min(0).optional().describe("The number of records to skip")
        },
    }, async ({ project_id, suite_id, ...options }) => {
        try {
            const sections = await clients.sections.getSections(project_id, suite_id, options);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(sections, null, 2)
                    }
                ]
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: error instanceof Error ? error.message : "Unknown error",
                            project_id,
                            suite_id,
                            details: "Failed to get sections"
                        }, null, 2)
                    }
                ]
            };
        }
    });
    /**
     * Create a new section
     */
    server.registerTool("testrail_add_section", {
        description: "Create a new section in a project with optional parent section for hierarchies",
        inputSchema: {
            project_id: z.number().positive().describe("The ID of the project"),
            name: z.string().min(1).describe("The name of the section"),
            description: z.string().optional().describe("The description of the section"),
            suite_id: z.number().positive().optional().describe("The ID of the test suite (required for multi-suite projects)"),
            parent_id: z.number().positive().optional().describe("The ID of the parent section (to build section hierarchies)")
        },
    }, async ({ project_id, ...data }) => {
        try {
            const section = await clients.sections.addSection(project_id, data);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(section, null, 2)
                    }
                ]
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: error instanceof Error ? error.message : "Unknown error",
                            project_id,
                            details: "Failed to create section"
                        }, null, 2)
                    }
                ]
            };
        }
    });
    /**
     * Update an existing section
     */
    server.registerTool("testrail_update_section", {
        description: "Update an existing section - supports partial updates, only submit fields you want to change",
        inputSchema: {
            section_id: z.number().positive().describe("The ID of the section to update"),
            name: z.string().min(1).optional().describe("The new name of the section"),
            description: z.string().optional().describe("The new description of the section")
        },
    }, async ({ section_id, ...data }) => {
        try {
            const section = await clients.sections.updateSection(section_id, data);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(section, null, 2)
                    }
                ]
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: error instanceof Error ? error.message : "Unknown error",
                            section_id,
                            details: "Failed to update section"
                        }, null, 2)
                    }
                ]
            };
        }
    });
    /**
     * Move a section to another suite or section
     */
    server.registerTool("testrail_move_section", {
        description: "Move a section to another suite or section - requires TestRail 6.5.2 or later",
        inputSchema: {
            section_id: z.number().positive().describe("The ID of the section to move"),
            parent_id: z.number().positive().optional().describe("The ID of the parent section (can be null for root level)"),
            after_id: z.number().positive().optional().describe("The section ID after which the section should be placed")
        },
    }, async ({ section_id, ...data }) => {
        try {
            const section = await clients.sections.moveSection(section_id, data);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(section, null, 2)
                    }
                ]
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: error instanceof Error ? error.message : "Unknown error",
                            section_id,
                            details: "Failed to move section"
                        }, null, 2)
                    }
                ]
            };
        }
    });
    /**
     * Delete an existing section
     */
    server.registerTool("testrail_delete_section", {
        description: "Delete an existing section and all related test cases - WARNING: This action cannot be undone!",
        inputSchema: {
            section_id: z.number().positive().describe("The ID of the section to delete"),
            soft: z.boolean().optional().describe("True to preview deletion effects only (soft=1), false to actually delete"),
            confirmation: z.literal("I_UNDERSTAND_THIS_DELETES_ALL_TEST_CASES").describe("Confirmation that you understand this deletes all test cases in the section")
        },
    }, async ({ section_id, soft, confirmation }) => {
        try {
            if (confirmation !== "I_UNDERSTAND_THIS_DELETES_ALL_TEST_CASES") {
                throw new Error("Confirmation required: deleting a section will delete all test cases");
            }
            const result = await clients.sections.deleteSection(section_id, soft);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(result, null, 2)
                    }
                ]
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: error instanceof Error ? error.message : "Unknown error",
                            section_id,
                            details: "Failed to delete section"
                        }, null, 2)
                    }
                ]
            };
        }
    });
}
//# sourceMappingURL=sections-tools.js.map