import { z } from "zod";
/**
 * Suite Tools
 * Tools for managing test suites in TestRail - create, read, update, delete operations.
 */
export function registerSuiteTools(server, clients) {
    /**
     * Get all test suites for a project
     */
    server.registerTool("testrail_get_suites", {
        description: "📦 Get all test suites for a project with pagination info and metadata",
        inputSchema: {
            project_id: z.number().describe("The ID of the project to get suites from")
        },
    }, async ({ project_id }) => {
        try {
            const suitesResponse = await clients.suites.getSuites(project_id);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(suitesResponse, null, 2)
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
                            error: "Failed to get test suites",
                            details: error.message,
                            project_id
                        }, null, 2)
                    }
                ],
                isError: true
            };
        }
    });
    /**
     * Get a specific test suite by ID
     */
    server.registerTool("testrail_get_suite", {
        description: "📋 Get detailed information about a specific test suite including metadata",
        inputSchema: {
            suite_id: z.number().describe("The ID of the test suite to retrieve")
        },
    }, async ({ suite_id }) => {
        try {
            const suite = await clients.suites.getSuite(suite_id);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(suite, null, 2)
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
                            error: "Failed to get test suite",
                            details: error.message,
                            suite_id
                        }, null, 2)
                    }
                ],
                isError: true
            };
        }
    });
    /**
     * Create a new test suite
     */
    server.registerTool("testrail_add_suite", {
        description: "➕ Create a new test suite in a project",
        inputSchema: {
            project_id: z.number().describe("The ID of the project to add the suite to"),
            name: z.string().describe("The name of the test suite"),
            description: z.string().optional().describe("Optional description of the test suite")
        },
    }, async ({ project_id, name, description }) => {
        try {
            const suiteData = { name, ...(description && { description }) };
            const suite = await clients.suites.addSuite(project_id, suiteData);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            message: "Test suite created successfully",
                            suite
                        }, null, 2)
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
                            error: "Failed to create test suite",
                            details: error.message,
                            project_id,
                            name
                        }, null, 2)
                    }
                ],
                isError: true
            };
        }
    });
    /**
     * Update an existing test suite
     */
    server.registerTool("testrail_update_suite", {
        description: "✏️ Update an existing test suite (partial updates supported)",
        inputSchema: {
            suite_id: z.number().describe("The ID of the test suite to update"),
            name: z.string().optional().describe("New name for the test suite"),
            description: z.string().optional().describe("New description for the test suite")
        },
    }, async ({ suite_id, name, description }) => {
        try {
            const suiteData = {};
            if (name)
                suiteData.name = name;
            if (description !== undefined)
                suiteData.description = description;
            const suite = await clients.suites.updateSuite(suite_id, suiteData);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            message: "Test suite updated successfully",
                            suite
                        }, null, 2)
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
                            error: "Failed to update test suite",
                            details: error.message,
                            suite_id
                        }, null, 2)
                    }
                ],
                isError: true
            };
        }
    });
    /**
     * Delete a test suite (with soft delete option)
     */
    server.registerTool("testrail_delete_suite", {
        description: "🗑️ Delete a test suite (WARNING: Cannot be undone - deletes all active runs & results)",
        inputSchema: {
            suite_id: z.number().describe("The ID of the test suite to delete"),
            soft: z.boolean().default(false).describe("If true, shows what would be deleted without actually deleting (preview mode)"),
            confirmation: z.literal("DELETE_SUITE").describe("Must be 'DELETE_SUITE' to confirm deletion (required for safety)")
        },
    }, async ({ suite_id, soft, confirmation }) => {
        if (confirmation !== "DELETE_SUITE") {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: "Invalid confirmation",
                            message: "Must provide confirmation='DELETE_SUITE' to delete a suite",
                            suite_id
                        }, null, 2)
                    }
                ],
                isError: true
            };
        }
        try {
            const result = await clients.suites.deleteSuite(suite_id, { soft: soft || false });
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            message: soft ? "Suite deletion preview (not actually deleted)" : "Test suite deleted successfully",
                            suite_id,
                            soft_delete: soft || false,
                            result
                        }, null, 2)
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
                            error: "Failed to delete test suite",
                            details: error.message,
                            suite_id
                        }, null, 2)
                    }
                ],
                isError: true
            };
        }
    });
}
//# sourceMappingURL=suites-tools.js.map