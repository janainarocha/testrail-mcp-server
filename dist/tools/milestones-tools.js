import { z } from "zod";
/**
 * Milestone Tools
 * Tools for retrieving and managing milestones in TestRail.
 */
export function registerMilestoneTools(server, clients) {
    /**
     * Get milestone details by ID
     */
    server.registerTool("testrail_get_milestone", {
        description: "Returns an existing milestone by ID.",
        inputSchema: {
            milestone_id: z.number().positive().describe("The ID of the milestone."),
        },
    }, async ({ milestone_id }) => {
        try {
            const milestone = await clients.milestones.getMilestone(milestone_id);
            return {
                content: [{ type: "text", text: JSON.stringify(milestone, null, 2) }],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({ error: error.message || "Unknown error", details: "Failed to get milestone" }, null, 2),
                    },
                ],
            };
        }
    });
    /**
     * Get milestones for a project (with filters)
     */
    server.registerTool("testrail_get_milestones", {
        description: "Returns the list of milestones for a project.",
        inputSchema: {
            project_id: z.number().positive().describe("The ID of the project."),
            is_completed: z.boolean().optional().describe("1 to return completed milestones only. 0 to return open milestones only."),
            is_started: z.boolean().optional().describe("1 to return started milestones only. 0 to return upcoming milestones only."),
            limit: z.number().positive().optional().describe("The number of milestones the response should return."),
            offset: z.number().min(0).optional().describe("Where to start counting the milestones from the offset."),
        },
    }, async ({ project_id, is_completed, is_started, limit, offset }) => {
        try {
            const milestones = await clients.milestones.getMilestones(project_id, {
                isCompleted: is_completed,
                isStarted: is_started,
                limit,
                offset,
            });
            return {
                content: [{ type: "text", text: JSON.stringify(milestones, null, 2) }],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({ error: error.message || "Unknown error", details: "Failed to get milestones" }, null, 2),
                    },
                ],
            };
        }
    });
    /**
     * Create a new milestone
     */
    server.registerTool("testrail_add_milestone", {
        description: "Creates a new milestone.",
        inputSchema: {
            project_id: z.number().positive().describe("The ID of the project the milestone should be added to."),
            name: z.string().min(1).describe("The name of the milestone."),
            description: z.string().optional().describe("The description of the milestone."),
            due_on: z.number().optional().describe("The due date of the milestone (as UNIX timestamp)."),
            parent_id: z.number().optional().describe("The ID of the parent milestone, if any."),
            refs: z.string().optional().describe("A comma-separated list of references/requirements."),
            start_on: z.number().optional().describe("The scheduled start date of the milestone (as UNIX timestamp)."),
        },
    }, async ({ project_id, name, description, due_on, parent_id, refs, start_on }) => {
        try {
            const milestone = await clients.milestones.addMilestone(project_id, {
                name,
                description,
                due_on,
                parent_id,
                refs,
                start_on,
            });
            return {
                content: [{ type: "text", text: JSON.stringify(milestone, null, 2) }],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({ error: error.message || "Unknown error", details: "Failed to add milestone" }, null, 2),
                    },
                ],
            };
        }
    });
    /**
     * Update an existing milestone (partial updates supported)
     */
    server.registerTool("testrail_update_milestone", {
        description: "Updates an existing milestone (partial updates supported).",
        inputSchema: {
            milestone_id: z.number().positive().describe("The ID of the milestone."),
            is_completed: z.boolean().optional().describe("True if a milestone is considered completed and false otherwise."),
            is_started: z.boolean().optional().describe("True if a milestone is considered started and false otherwise."),
            parent_id: z.number().optional().describe("The ID of the parent milestone, if any."),
            start_on: z.number().optional().describe("The scheduled start date of the milestone (as UNIX timestamp)."),
        },
    }, async ({ milestone_id, is_completed, is_started, parent_id, start_on }) => {
        try {
            const milestone = await clients.milestones.updateMilestone(milestone_id, {
                is_completed,
                is_started,
                parent_id,
                start_on,
            });
            return {
                content: [{ type: "text", text: JSON.stringify(milestone, null, 2) }],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({ error: error.message || "Unknown error", details: "Failed to update milestone" }, null, 2),
                    },
                ],
            };
        }
    });
}
//# sourceMappingURL=milestones-tools.js.map