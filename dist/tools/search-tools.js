import { z } from "zod";
/**
 * Search and Metadata Tools
 * These tools handle searching, filtering, and retrieving metadata about TestRail entities.
 */
export function registerSearchTools(server, clients) {
    /**
     * Advanced search for test cases with filters
     */
    server.registerTool("testrail_search_test_cases_advanced", {
        description: "🔍 Advanced search for test cases with multiple filters (priority, type, date, text search)",
        inputSchema: {
            project_id: z.number().describe("Project ID to search in"),
            suite_id: z.number().describe("Suite ID to filter by (required for multi-suite projects)"),
            section_id: z.number().optional().describe("Section ID to filter by"),
            filter_text: z.string().optional().describe("Text to search in test case titles"),
            priority_ids: z.array(z.number()).optional().describe("Priority IDs to filter by (1=Low, 2=Medium, 3=High, 4=Critical)"),
            type_ids: z.array(z.number()).optional().describe("Case type IDs to filter by"),
            created_after: z.string().optional().describe("Only cases created after this date (YYYY-MM-DD)"),
            created_before: z.string().optional().describe("Only cases created before this date (YYYY-MM-DD)"),
            limit: z.number().optional().describe("Maximum number of results (default 50)"),
        },
    }, async ({ project_id, suite_id, section_id, filter_text, priority_ids, type_ids, created_after, created_before, limit = 50 }) => {
        try {
            const options = {
                suiteId: suite_id,
                sectionId: section_id,
                filter: filter_text,
                priorityIds: priority_ids,
                typeIds: type_ids,
                limit,
            };
            if (created_after) {
                options.createdAfter = new Date(created_after);
            }
            if (created_before) {
                options.createdBefore = new Date(created_before);
            }
            const cases = await clients.cases.getCasesAdvanced(project_id, options);
            const result = {
                search_parameters: {
                    project_id,
                    suite_id,
                    section_id,
                    filter_text,
                    priority_ids,
                    type_ids,
                    created_after,
                    created_before,
                    limit
                },
                total_found: cases.length,
                test_cases: cases.slice(0, limit)
            };
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
                            details: "Failed to search test cases"
                        }, null, 2)
                    }
                ]
            };
        }
    });
    /**
     * Get test case history/audit trail
     */
    server.registerTool("testrail_get_test_case_history", {
        description: "📜 Get change history and audit trail for a test case - shows who changed what and when",
        inputSchema: {
            case_id: z.number().describe("Test case ID to get history for"),
            limit: z.number().optional().describe("Maximum number of history entries (default 10)"),
        },
    }, async ({ case_id, limit = 10 }) => {
        try {
            const history = await clients.cases.getCaseHistory(case_id, limit);
            const result = {
                case_id,
                total_changes: history.length,
                history: history.map((entry) => ({
                    change_date: new Date(entry.created_on * 1000).toISOString(),
                    user_id: entry.user_id,
                    changes: entry.changes.map((change) => ({
                        field: change.field,
                        label: change.label,
                        old_value: change.old_text || change.old_value,
                        new_value: change.new_text || change.new_value
                    }))
                }))
            };
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
                            case_id,
                            details: "Failed to get test case history"
                        }, null, 2)
                    }
                ]
            };
        }
    });
    /**
     * Get metadata for test case creation
     */
    server.registerTool("testrail_get_case_metadata", {
        description: "📊 Get available case types, priorities, and custom fields for better test case creation",
    }, async () => {
        try {
            const [caseTypes, priorities, caseFields] = await Promise.all([
                clients.caseTypes.getCaseTypes(),
                clients.priorities.getPriorities(),
                clients.caseFields.getCaseFields()
            ]);
            const result = {
                case_types: caseTypes,
                priorities: priorities,
                custom_fields: caseFields
            };
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
                            details: "Failed to retrieve metadata"
                        }, null, 2)
                    }
                ]
            };
        }
    });
    /**
     * Get test result statuses
     */
    server.registerTool("testrail_get_test_statuses", {
        description: "📊 Get available test result statuses - understand status options for test execution",
    }, async () => {
        try {
            const statuses = await clients.statuses.getStatuses();
            const result = {
                test_statuses: statuses
            };
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
                            details: "Failed to retrieve test statuses"
                        }, null, 2)
                    }
                ]
            };
        }
    });
}
//# sourceMappingURL=search-tools.js.map