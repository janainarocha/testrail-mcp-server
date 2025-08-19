import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailStatusesAPI } from "../api/testrail-statuses.js";
import { z } from "zod";

/**
 * Status Tools
 * Tools for retrieving test statuses and case statuses in TestRail.
 */

export function registerStatusTools(server: McpServer, clients: { statuses: TestRailStatusesAPI }) {
	/**
	 * Get all test statuses (system and custom)
	 */
	server.registerTool(
		"testrail_get_statuses",
		{
			description: "Get all available test statuses (system and custom) including colors and properties",
			inputSchema: {
				// No input parameters required
			},
		},
		async () => {
			try {
				const statuses = await clients.statuses.getStatuses();

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(statuses, null, 2)
						}
					]
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({
								error: error instanceof Error ? error.message : "Unknown error",
								details: "Failed to get test statuses"
							}, null, 2)
						}
					]
				};
			}
		}
	);

	/**
	 * Get all test case statuses
	 */
	server.registerTool(
		"testrail_get_case_statuses",
		{
			description: "Get all available test case statuses with approval information - requires TestRail Enterprise 7.3+",
			inputSchema: {
				// No input parameters required
			},
		},
		async () => {
			try {
				const caseStatuses = await clients.statuses.getCaseStatuses();

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(caseStatuses, null, 2)
						}
					]
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({
								error: error instanceof Error ? error.message : "Unknown error",
								details: "Failed to get case statuses"
							}, null, 2)
						}
					]
				};
			}
		}
	);
}
