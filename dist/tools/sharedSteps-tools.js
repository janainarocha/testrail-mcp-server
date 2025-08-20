import { z } from "zod";
/**
 * Shared Step Tools
 * Tools for managing shared steps in TestRail (requires TestRail 7.0+).
 */
export function registerSharedStepTools(server, clients) {
    /**
     * Get a specific shared step
     */
    server.registerTool("testrail_get_shared_step", {
        description: "Get a specific shared step by ID with complete details including steps and usage - requires TestRail 7.0+",
        inputSchema: {
            shared_step_id: z.number().positive().describe("The ID of the shared step")
        },
    }, async ({ shared_step_id }) => {
        try {
            const sharedStep = await clients.sharedSteps.getSharedStep(shared_step_id);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(sharedStep, null, 2)
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
                            shared_step_id,
                            details: "Failed to get shared step"
                        }, null, 2)
                    }
                ]
            };
        }
    });
    /**
     * Get shared step history
     */
    server.registerTool("testrail_get_shared_step_history", {
        description: "Get change history for a shared step showing all modifications over time - requires TestRail 7.3+",
        inputSchema: {
            shared_step_id: z.number().positive().describe("The ID of the shared step")
        },
    }, async ({ shared_step_id }) => {
        try {
            const history = await clients.sharedSteps.getSharedStepHistory(shared_step_id);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(history, null, 2)
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
                            shared_step_id,
                            details: "Failed to get shared step history"
                        }, null, 2)
                    }
                ]
            };
        }
    });
    /**
     * Get shared steps for a project
     */
    server.registerTool("testrail_get_shared_steps", {
        description: "Get shared steps for a project with optional filtering and pagination - requires TestRail 7.0+",
        inputSchema: {
            project_id: z.number().positive().describe("The ID of the project"),
            created_after: z.number().optional().describe("Only return shared steps created after this date (UNIX timestamp)"),
            created_before: z.number().optional().describe("Only return shared steps created before this date (UNIX timestamp)"),
            created_by: z.array(z.number()).optional().describe("Array of creator user IDs to filter by"),
            limit: z.number().positive().max(250).optional().describe("The number of shared steps to return (max 250)"),
            offset: z.number().min(0).optional().describe("The number of records to skip"),
            updated_after: z.number().optional().describe("Only return shared steps updated after this date (UNIX timestamp)"),
            updated_before: z.number().optional().describe("Only return shared steps updated before this date (UNIX timestamp)"),
            refs: z.string().optional().describe("A single Reference ID (e.g. TR-a, 4291, etc.)")
        },
    }, async ({ project_id, ...options }) => {
        try {
            const sharedSteps = await clients.sharedSteps.getSharedSteps(project_id, options);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(sharedSteps, null, 2)
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
                            details: "Failed to get shared steps"
                        }, null, 2)
                    }
                ]
            };
        }
    });
    /**
     * Create a new shared step
     */
    server.registerTool("testrail_add_shared_step", {
        description: "Create a new shared step with reusable test steps - requires TestRail 7.0+ and test case permissions",
        inputSchema: {
            project_id: z.number().positive().describe("The ID of the project"),
            title: z.string().min(1).describe("The title for the shared step"),
            custom_steps_separated: z.array(z.object({
                content: z.string().optional().describe("The text contents of the Step field"),
                additional_info: z.string().optional().describe("The text contents of the Additional Info field"),
                expected: z.string().optional().describe("The text contents of the Expected Result field"),
                refs: z.string().optional().describe("Reference information for the References field")
            })).optional().describe("Array of step objects containing the individual steps")
        },
    }, async ({ project_id, ...data }) => {
        try {
            const sharedStep = await clients.sharedSteps.addSharedStep(project_id, data);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(sharedStep, null, 2)
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
                            details: "Failed to create shared step"
                        }, null, 2)
                    }
                ]
            };
        }
    });
    /**
     * Update an existing shared step
     */
    server.registerTool("testrail_update_shared_step", {
        description: "Update an existing shared step - supports partial updates, WARNING: custom_steps_separated replaces ALL steps",
        inputSchema: {
            shared_step_id: z.number().positive().describe("The ID of the shared step to update"),
            title: z.string().min(1).optional().describe("The new title for the shared step"),
            custom_steps_separated: z.array(z.object({
                content: z.string().optional().describe("The text contents of the Step field"),
                additional_info: z.string().optional().describe("The text contents of the Additional Info field"),
                expected: z.string().optional().describe("The text contents of the Expected Result field"),
                refs: z.string().optional().describe("Reference information for the References field")
            })).optional().describe("Array of step objects - WARNING: This replaces ALL existing steps")
        },
    }, async ({ shared_step_id, ...data }) => {
        try {
            const sharedStep = await clients.sharedSteps.updateSharedStep(shared_step_id, data);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(sharedStep, null, 2)
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
                            shared_step_id,
                            details: "Failed to update shared step"
                        }, null, 2)
                    }
                ]
            };
        }
    });
    /**
     * Delete an existing shared step
     */
    server.registerTool("testrail_delete_shared_step", {
        description: "Delete an existing shared step - WARNING: This action cannot be undone!",
        inputSchema: {
            shared_step_id: z.number().positive().describe("The ID of the shared step to delete"),
            keep_in_cases: z.boolean().describe("True to keep steps in test cases, false to remove from test cases too"),
            confirmation: z.literal("I_UNDERSTAND_THIS_CANNOT_BE_UNDONE").describe("Confirmation that you understand this action is irreversible")
        },
    }, async ({ shared_step_id, keep_in_cases, confirmation }) => {
        try {
            if (confirmation !== "I_UNDERSTAND_THIS_CANNOT_BE_UNDONE") {
                throw new Error("Confirmation required: deleting shared steps cannot be undone");
            }
            await clients.sharedSteps.deleteSharedStep(shared_step_id, { keep_in_cases });
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            shared_step_id,
                            keep_in_cases,
                            message: "Shared step deleted successfully"
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
                            error: error instanceof Error ? error.message : "Unknown error",
                            shared_step_id,
                            details: "Failed to delete shared step"
                        }, null, 2)
                    }
                ]
            };
        }
    });
}
//# sourceMappingURL=sharedSteps-tools.js.map