import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailTemplatesAPI } from "../api/testrail-templates.js";
import { z } from "zod";

/**
 * Template Tools
 * Tools for retrieving template information (field layouts) in TestRail.
 * Templates define the field layouts for test cases and results.
 */

export function registerTemplateTools(server: McpServer, clients: { templates: TestRailTemplatesAPI }) {
	/**
	 * Get all available templates for a project
	 */
	server.registerTool(
		"testrail_get_templates",
		{
			description: "📋 Get all available templates (field layouts) for a project - defines structure for test cases and results (TestRail 5.2+)",
			inputSchema: {
				project_id: z.number().describe("The ID of the project to get templates from")
			},
		},
		async ({ project_id }) => {
			try {
				const templates = await clients.templates.getTemplates(project_id);

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(templates, null, 2)
						}
					]
				};
			} catch (error: any) {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({
								error: "Failed to get templates",
								details: error.message,
								project_id,
								note: "Templates require TestRail 5.2 or later"
							}, null, 2)
						}
					],
					isError: true
				};
			}
		}
	);
}