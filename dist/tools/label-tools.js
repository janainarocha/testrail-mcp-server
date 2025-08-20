import { z } from "zod";
/**
 * Label Tools
 * Tools for retrieving and managing labels in TestRail.
 */
export function registerLabelTools(server, clients) {
    /**
     * Get label details by ID
     */
    server.registerTool("testrail_get_label", {
        description: "Returns an existing label by ID.",
        inputSchema: {
            label_id: z.number().positive().describe("The ID of the label."),
        },
    }, async ({ label_id }) => {
        try {
            const label = await clients.labels.getLabel(label_id);
            return {
                content: [{ type: "text", text: JSON.stringify(label, null, 2) }],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({ error: error.message || "Unknown error", details: "Failed to get label" }, null, 2),
                    },
                ],
            };
        }
    });
    /**
     * Get all labels for a project
     */
    server.registerTool("testrail_get_labels", {
        description: "Returns a list of existing labels for a project.",
        inputSchema: {
            project_id: z.number().positive().describe("The ID of the project."),
            offset: z.number().min(0).optional().describe("Where to start counting the labels from the offset."),
            limit: z.number().positive().optional().describe("The number of labels the response should return."),
        },
    }, async ({ project_id, offset, limit }) => {
        try {
            const labels = await clients.labels.getLabels(project_id, limit, offset);
            return {
                content: [{ type: "text", text: JSON.stringify(labels, null, 2) }],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({ error: error.message || "Unknown error", details: "Failed to get labels" }, null, 2),
                    },
                ],
            };
        }
    });
    /**
     * Update an existing label
     */
    server.registerTool("testrail_update_label", {
        description: "Updates an existing label.",
        inputSchema: {
            label_id: z.number().positive().describe("The ID of the label to update."),
            project_id: z.number().positive().describe("The ID of the project where the label is to be updated."),
            title: z.string().max(20).describe("The title of the label. Maximum 20 characters allowed."),
        },
    }, async ({ label_id, project_id, title }) => {
        try {
            const result = await clients.labels.updateLabel(label_id, project_id, title);
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({ error: error.message || "Unknown error", details: "Failed to update label" }, null, 2),
                    },
                ],
            };
        }
    });
}
//# sourceMappingURL=label-tools.js.map