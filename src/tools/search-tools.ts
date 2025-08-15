import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailAPI } from "../testrail-api.js";

/**
 * Search and Metadata Tools
 * These tools handle searching, filtering, and retrieving metadata about TestRail entities.
 */
export function registerSearchTools(server: McpServer, api: TestRailAPI) {
	/**
	 * Advanced search for test cases with filters
	 */
	server.registerTool(
		"search_test_cases_advanced",
		{
			description: "🔍 Advanced search for test cases with multiple filters (priority, type, date, text search)",
			inputSchema: {
				project_id: z.number().describe("Project ID to search in"),
				suite_id: z.number().optional().describe("Suite ID to filter by"),
				section_id: z.number().optional().describe("Section ID to filter by"),
				filter_text: z.string().optional().describe("Text to search in test case titles"),
				priority_ids: z.array(z.number()).optional().describe("Priority IDs to filter by (1=Low, 2=Medium, 3=High, 4=Critical)"),
				type_ids: z.array(z.number()).optional().describe("Case type IDs to filter by"),
				created_after: z.string().optional().describe("Only cases created after this date (YYYY-MM-DD)"),
				created_before: z.string().optional().describe("Only cases created before this date (YYYY-MM-DD)"),
				limit: z.number().optional().describe("Maximum number of results (default 50)"),
			},
		},
		async ({ project_id, suite_id, section_id, filter_text, priority_ids, type_ids, created_after, created_before, limit = 50 }) => {
			const options: any = {
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

			const cases = await api.getCasesAdvanced(project_id, options);

			return {
				content: [
					{
						type: "text",
						text:
							`# 🔍 Advanced Search Results\n\n` +
							`**Search Parameters:**\n` +
							`- Project: ${project_id}\n` +
							`${suite_id ? `- Suite: ${suite_id}\n` : ""}` +
							`${section_id ? `- Section: ${section_id}\n` : ""}` +
							`${filter_text ? `- Text Filter: "${filter_text}"\n` : ""}` +
							`${priority_ids?.length ? `- Priorities: ${priority_ids.join(", ")}\n` : ""}` +
							`${type_ids?.length ? `- Types: ${type_ids.join(", ")}\n` : ""}` +
							`${created_after ? `- Created After: ${created_after}\n` : ""}` +
							`${created_before ? `- Created Before: ${created_before}\n` : ""}` +
							`\n**Found ${cases.length} test cases:**\n\n` +
							cases
								.slice(0, limit)
								.map((tc) => `📋 **${tc.title}** (ID: ${tc.id})\n` + `   Section: ${tc.section_id} | Priority: ${tc.priority_id === 1 ? "Low" : tc.priority_id === 2 ? "Medium" : tc.priority_id === 3 ? "High" : "Critical"} | Type: ${tc.type_id}\n`)
								.join("\n\n") +
							`${cases.length > limit ? `\n\n... and ${cases.length - limit} more results` : ""}`,
					},
				],
			};
		}
	);

	/**
	 * Get test case history/audit trail
	 */
	server.registerTool(
		"get_test_case_history",
		{
			description: "📜 Get change history and audit trail for a test case - shows who changed what and when",
			inputSchema: {
				case_id: z.number().describe("Test case ID to get history for"),
				limit: z.number().optional().describe("Maximum number of history entries (default 10)"),
			},
		},
		async ({ case_id, limit = 10 }) => {
			try {
				const history = await api.getCaseHistory(case_id, limit);

				return {
					content: [
						{
							type: "text",
							text:
								`# 📜 Test Case History - ID: ${case_id}\n\n` +
								`**${history.length} changes found:**\n\n` +
								history
									.map((entry) => {
										const changeDate = new Date(entry.created_on * 1000).toLocaleString();
										const changes = entry.changes.map((change: any) => `   - **${change.label || change.field}**: "${change.old_text || change.old_value}" → "${change.new_text || change.new_value}"`).join("\n");

										return `## Change on ${changeDate}\n` + `**User ID:** ${entry.user_id}\n` + `**Changes:**\n${changes}`;
									})
									.join("\n\n") +
								`\n\n💡 **Tip:** Use this to track who made changes and when for audit purposes.`,
						},
					],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `❌ **Cannot get history for test case ${case_id}**\n\n` + `Error: ${error instanceof Error ? error.message : "Unknown error"}\n\n` + `The test case may not exist or you may not have permission to view it.`,
						},
					],
				};
			}
		}
	);

	/**
	 * Get metadata for test case creation
	 */
	server.registerTool(
		"get_case_metadata",
		{
			description: "📊 Get available case types, priorities, and custom fields for better test case creation",
		},
		async () => {
			try {
				const [caseTypes, priorities, caseFields] = await Promise.all([api.getCaseTypes(), api.getPriorities(), api.getCaseFields()]);

				return {
					content: [
						{
							type: "text",
							text:
								`# 📊 TestRail Metadata\n\n` +
								`## Case Types\n` +
								caseTypes.map((type) => `- **${type.name}** (ID: ${type.id}): ${type.is_default ? "✅ Default" : ""}`).join("\n") +
								`\n\n## Priorities\n` +
								priorities.map((priority) => `- **${priority.name}** (ID: ${priority.id}): ${priority.is_default ? "✅ Default" : ""}`).join("\n") +
								`\n\n## Custom Fields\n` +
								caseFields
									.slice(0, 10)
									.map((field) => `- **${field.label}** (${field.name}): ${field.type_id === 1 ? "String" : field.type_id === 2 ? "Integer" : field.type_id === 3 ? "Text" : "Other"}`)
									.join("\n") +
								`${caseFields.length > 10 ? `\n... and ${caseFields.length - 10} more fields` : ""}` +
								`\n\n💡 **Usage:** Use these IDs when creating test cases to ensure compatibility.`,
						},
					],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `❌ **Cannot retrieve metadata**\n\n` + `Error: ${error instanceof Error ? error.message : "Unknown error"}\n\n` + `You may not have permission to access this information.`,
						},
					],
				};
			}
		}
	);

	/**
	 * Get test result statuses
	 */
	server.registerTool(
		"get_test_statuses",
		{
			description: "📊 Get available test result statuses - understand status options for test execution",
		},
		async () => {
			try {
				const statuses = await api.getStatuses();

				return {
					content: [
						{
							type: "text",
							text: `# 📊 Test Result Statuses\n\n` + statuses.map((status: any) => `- **${status.name}** (ID: ${status.id}): ${status.label}\n` + `  Color: ${status.color_dark || status.color_medium} | ${status.is_system ? "🔒 System" : "👤 Custom"} | ${status.is_final ? "🏁 Final" : "🔄 In Progress"}`).join("\n") + `\n\n💡 **Usage:** Use these status IDs when updating test results during execution.`,
						},
					],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `❌ **Cannot retrieve test statuses**\n\n` + `Error: ${error instanceof Error ? error.message : "Unknown error"}\n\n` + `You may not have permission to access this information.`,
						},
					],
				};
			}
		}
	);
}
