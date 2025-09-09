import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
export function registerAttachmentTools(server, attachments) {
    /**
     * Add attachment to test case
     */
    server.registerTool("testrail_add_attachment_to_case", {
        description: "📎 Add an attachment to a test case in TestRail (requires TestRail 6.5.2+, max 256MB)",
        inputSchema: {
            case_id: z.number().positive().describe("The ID of the test case to attach the file to"),
            file_path: z.string().describe("Absolute path to the file to upload (e.g., 'C:\\screenshots\\test.png')"),
            filename: z.string().optional().describe("Optional custom filename for the attachment")
        },
    }, async ({ case_id, file_path, filename }) => {
        try {
            const result = await attachments.addAttachmentToCase(case_id, file_path, filename);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            attachment_id: result.attachment_id,
                            case_id,
                            message: "Attachment uploaded successfully to test case"
                        }, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            throw new McpError(ErrorCode.InternalError, `Failed to add attachment to case: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    /**
     * Add attachment to test plan
     */
    server.registerTool("testrail_add_attachment_to_plan", {
        description: "📎 Add an attachment to a test plan in TestRail (requires TestRail 6.3+, max 256MB)",
        inputSchema: {
            plan_id: z.number().positive().describe("The ID of the test plan to attach the file to"),
            file_path: z.string().describe("Absolute path to the file to upload (e.g., 'C:\\documents\\plan.pdf')"),
            filename: z.string().optional().describe("Optional custom filename for the attachment")
        },
    }, async ({ plan_id, file_path, filename }) => {
        try {
            const result = await attachments.addAttachmentToPlan(plan_id, file_path, filename);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            attachment_id: result.attachment_id,
                            plan_id,
                            message: "Attachment uploaded successfully to test plan"
                        }, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            throw new McpError(ErrorCode.InternalError, `Failed to add attachment to plan: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    /**
     * Add attachment to test plan entry
     */
    server.registerTool("testrail_add_attachment_to_plan_entry", {
        description: "📎 Add an attachment to a test plan entry in TestRail (requires TestRail 6.3+, max 256MB)",
        inputSchema: {
            plan_id: z.number().positive().describe("The ID of the test plan containing the entry"),
            entry_id: z.number().positive().describe("The ID of the test plan entry to attach the file to"),
            file_path: z.string().describe("Absolute path to the file to upload"),
            filename: z.string().optional().describe("Optional custom filename for the attachment")
        },
    }, async ({ plan_id, entry_id, file_path, filename }) => {
        try {
            const result = await attachments.addAttachmentToPlanEntry(plan_id, entry_id, file_path, filename);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            attachment_id: result.attachment_id,
                            plan_id,
                            entry_id,
                            message: "Attachment uploaded successfully to test plan entry"
                        }, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            throw new McpError(ErrorCode.InternalError, `Failed to add attachment to plan entry: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    /**
     * Add attachment to test result
     */
    server.registerTool("testrail_add_attachment_to_result", {
        description: "📎 Add an attachment to a test result in TestRail (requires TestRail 5.7+, max 256MB) - IMPORTANT: Test result editing must be enabled in Site Settings",
        inputSchema: {
            result_id: z.number().positive().describe("The ID of the test result to attach the file to"),
            file_path: z.string().describe("Absolute path to the file to upload (e.g., 'C:\\logs\\error.log')"),
            filename: z.string().optional().describe("Optional custom filename for the attachment")
        },
    }, async ({ result_id, file_path, filename }) => {
        try {
            const result = await attachments.addAttachmentToResult(result_id, file_path, filename);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            attachment_id: result.attachment_id,
                            result_id,
                            message: "Attachment uploaded successfully to test result"
                        }, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            throw new McpError(ErrorCode.InternalError, `Failed to add attachment to result: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    /**
     * Add attachment to test run
     */
    server.registerTool("testrail_add_attachment_to_run", {
        description: "📎 Add an attachment to a test run in TestRail (requires TestRail 6.3+, max 256MB)",
        inputSchema: {
            run_id: z.number().positive().describe("The ID of the test run to attach the file to"),
            file_path: z.string().describe("Absolute path to the file to upload"),
            filename: z.string().optional().describe("Optional custom filename for the attachment")
        },
    }, async ({ run_id, file_path, filename }) => {
        try {
            const result = await attachments.addAttachmentToRun(run_id, file_path, filename);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            attachment_id: result.attachment_id,
                            run_id,
                            message: "Attachment uploaded successfully to test run"
                        }, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            throw new McpError(ErrorCode.InternalError, `Failed to add attachment to run: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    /**
     * Get attachments for test case
     */
    server.registerTool("testrail_get_attachments_for_case", {
        description: "📋 Get all attachments for a test case in TestRail (requires TestRail 5.7+)",
        inputSchema: {
            case_id: z.number().positive().describe("The ID of the test case to get attachments for"),
            limit: z.number().positive().max(250).optional().describe("Maximum number of attachments to return (default: 250)"),
            offset: z.number().min(0).optional().describe("Number of attachments to skip (for pagination)")
        },
    }, async ({ case_id, limit, offset }) => {
        try {
            const result = await attachments.getAttachmentsForCase(case_id, { limit, offset });
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            case_id,
                            total_attachments: result.size,
                            returned_count: result.attachments.length,
                            offset: result.offset,
                            limit: result.limit,
                            attachments: result.attachments,
                            pagination: {
                                next: result._links?.next || result._link?.next,
                                prev: result._links?.prev || result._link?.prev
                            }
                        }, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            throw new McpError(ErrorCode.InternalError, `Failed to get attachments for case: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    /**
     * Get attachments for test plan
     */
    server.registerTool("testrail_get_attachments_for_plan", {
        description: "📋 Get all attachments for a test plan in TestRail (requires TestRail 6.3+)",
        inputSchema: {
            plan_id: z.number().positive().describe("The ID of the test plan to get attachments for"),
            limit: z.number().positive().max(250).optional().describe("Maximum number of attachments to return (default: 250)"),
            offset: z.number().min(0).optional().describe("Number of attachments to skip (for pagination)")
        },
    }, async ({ plan_id, limit, offset }) => {
        try {
            const result = await attachments.getAttachmentsForPlan(plan_id, { limit, offset });
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            plan_id,
                            total_attachments: result.size,
                            returned_count: result.attachments.length,
                            offset: result.offset,
                            limit: result.limit,
                            attachments: result.attachments,
                            pagination: {
                                next: result._links?.next || result._link?.next,
                                prev: result._links?.prev || result._link?.prev
                            }
                        }, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            throw new McpError(ErrorCode.InternalError, `Failed to get attachments for plan: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    /**
     * Get attachments for test plan entry
     */
    server.registerTool("testrail_get_attachments_for_plan_entry", {
        description: "📋 Get all attachments for a test plan entry in TestRail (requires TestRail 6.3+)",
        inputSchema: {
            plan_id: z.number().positive().describe("The ID of the test plan containing the entry"),
            entry_id: z.number().positive().describe("The ID of the test plan entry to get attachments for"),
            limit: z.number().positive().max(250).optional().describe("Maximum number of attachments to return (default: 250)"),
            offset: z.number().min(0).optional().describe("Number of attachments to skip (for pagination)")
        },
    }, async ({ plan_id, entry_id, limit, offset }) => {
        try {
            const result = await attachments.getAttachmentsForPlanEntry(plan_id, entry_id, { limit, offset });
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            plan_id,
                            entry_id,
                            total_attachments: result.size,
                            returned_count: result.attachments.length,
                            offset: result.offset,
                            limit: result.limit,
                            attachments: result.attachments,
                            pagination: {
                                next: result._links?.next || result._link?.next,
                                prev: result._links?.prev || result._link?.prev
                            }
                        }, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            throw new McpError(ErrorCode.InternalError, `Failed to get attachments for plan entry: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    /**
     * Get attachments for test run
     */
    server.registerTool("testrail_get_attachments_for_run", {
        description: "📋 Get all attachments for a test run in TestRail (requires TestRail 6.3+)",
        inputSchema: {
            run_id: z.number().positive().describe("The ID of the test run to get attachments for"),
            limit: z.number().positive().max(250).optional().describe("Maximum number of attachments to return (default: 250)"),
            offset: z.number().min(0).optional().describe("Number of attachments to skip (for pagination)")
        },
    }, async ({ run_id, limit, offset }) => {
        try {
            const result = await attachments.getAttachmentsForRun(run_id, { limit, offset });
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            run_id,
                            total_attachments: result.size,
                            returned_count: result.attachments.length,
                            offset: result.offset,
                            limit: result.limit,
                            attachments: result.attachments,
                            pagination: {
                                next: result._links?.next || result._link?.next,
                                prev: result._links?.prev || result._link?.prev
                            }
                        }, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            throw new McpError(ErrorCode.InternalError, `Failed to get attachments for run: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    /**
     * Get attachments for test result
     */
    server.registerTool("testrail_get_attachments_for_result", {
        description: "📋 Get all attachments for a test result in TestRail (requires TestRail 5.7+)",
        inputSchema: {
            result_id: z.number().positive().describe("The ID of the test result to get attachments for"),
            limit: z.number().positive().max(250).optional().describe("Maximum number of attachments to return (default: 250)"),
            offset: z.number().min(0).optional().describe("Number of attachments to skip (for pagination)")
        },
    }, async ({ result_id, limit, offset }) => {
        try {
            const result = await attachments.getAttachmentsForResult(result_id, { limit, offset });
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            result_id,
                            total_attachments: result.size,
                            returned_count: result.attachments.length,
                            offset: result.offset,
                            limit: result.limit,
                            attachments: result.attachments,
                            pagination: {
                                next: result._links?.next || result._link?.next,
                                prev: result._links?.prev || result._link?.prev
                            }
                        }, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            throw new McpError(ErrorCode.InternalError, `Failed to get attachments for result: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    /**
     * Get attachments for test
     */
    server.registerTool("testrail_get_attachments_for_test", {
        description: "📋 Get all attachments for a test in TestRail (requires TestRail 5.7+)",
        inputSchema: {
            test_id: z.number().positive().describe("The ID of the test to get attachments for"),
            limit: z.number().positive().max(250).optional().describe("Maximum number of attachments to return (default: 250)"),
            offset: z.number().min(0).optional().describe("Number of attachments to skip (for pagination)")
        },
    }, async ({ test_id, limit, offset }) => {
        try {
            const result = await attachments.getAttachmentsForTest(test_id, { limit, offset });
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            test_id,
                            total_attachments: result.size,
                            returned_count: result.attachments.length,
                            offset: result.offset,
                            limit: result.limit,
                            attachments: result.attachments,
                            pagination: {
                                next: result._links?.next || result._link?.next,
                                prev: result._links?.prev || result._link?.prev
                            }
                        }, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            throw new McpError(ErrorCode.InternalError, `Failed to get attachments for test: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    /**
     * Download an attachment
     */
    server.registerTool("testrail_download_attachment", {
        description: "💾 Download an attachment from TestRail by its ID - returns attachment content as base64 encoded string",
        inputSchema: {
            attachment_id: z.union([z.string(), z.number()]).describe("The ID of the attachment to download (can be numeric or string format)")
        },
    }, async ({ attachment_id }) => {
        try {
            const buffer = await attachments.getAttachment(attachment_id);
            const base64Content = Buffer.from(buffer).toString('base64');
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            attachment_id,
                            content_base64: base64Content,
                            size_bytes: buffer.byteLength,
                            message: "Attachment downloaded successfully. Content is base64 encoded."
                        }, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            throw new McpError(ErrorCode.InternalError, `Failed to download attachment: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
    /**
     * Delete an attachment
     */
    server.registerTool("testrail_delete_attachment", {
        description: "🗑️ Delete an attachment from TestRail - DANGEROUS: This action cannot be undone!",
        inputSchema: {
            attachment_id: z.union([z.string(), z.number()]).describe("The ID of the attachment to delete"),
            confirmation: z.literal("I_UNDERSTAND_THIS_IS_PERMANENT").describe("Confirmation that you understand this deletion is permanent")
        },
    }, async ({ attachment_id, confirmation }) => {
        try {
            await attachments.deleteAttachment(attachment_id);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            attachment_id,
                            message: "Attachment deleted successfully",
                            warning: "This action was permanent and cannot be undone"
                        }, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            throw new McpError(ErrorCode.InternalError, `Failed to delete attachment: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    });
}
//# sourceMappingURL=attachments-tools.js.map