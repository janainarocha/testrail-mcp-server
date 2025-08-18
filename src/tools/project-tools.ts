import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { TestRailProjectsAPI, TestRailSuitesAPI, TestRailSectionsAPI, TestRailMilestonesAPI, TestRailPrioritiesAPI } from "../api/index.js";

/**
 * Register project-related MCP tools
 */
export function registerProjectTools(
	server: McpServer,
	clients: {
		projects: TestRailProjectsAPI;
		suites: TestRailSuitesAPI;
		sections: TestRailSectionsAPI;
		milestones: TestRailMilestonesAPI;
		priorities: TestRailPrioritiesAPI;
	}
) {
	/**
	 * List all projects
	 */
	server.registerTool(
		"testrail_list_projects",
		{
			description: "Get a list of all TestRail projects accessible to the authenticated user",
		},
		async () => {
			try {
				const projectsResponse = await clients.projects.getProjects();

				// Ensure projects is always an array
				const projects = Array.isArray(projectsResponse) ? projectsResponse : [];

				if (projects.length === 0) {
					return {
						content: [
							{
								type: "text",
								text: "🔍 **No TestRail projects found**\n\nPossible reasons:\n• No projects exist in your TestRail instance\n• Your user account doesn't have access to any projects\n• Check your credentials and permissions",
							},
						],
					};
				}

				return {
					content: [
						{
							type: "text",
							text:
								`## 📋 TestRail Projects Summary\n\n` +
								`Found **${projects.length} projects** in your TestRail instance:\n\n` +
								`### Active Projects (${projects.filter((p) => !p.is_completed).length}):\n` +
								projects
									.filter((p) => !p.is_completed)
									.map((p: any) => `• **${p.name}** (ID: ${p.id})${p.announcement ? ` - ${p.announcement}` : ""}`)
									.join("\n") +
								"\n\n" +
								(projects.filter((p) => p.is_completed).length > 0
									? `### Completed Projects (${projects.filter((p) => p.is_completed).length}):\n` +
									  projects
											.filter((p) => p.is_completed)
											.map((p: any) => `• **${p.name}** (ID: ${p.id})${p.announcement ? ` - ${p.announcement}` : ""}`)
											.join("\n") +
									  "\n\n"
									: "") +
								`💡 **Next steps:**\n` +
								`• Use \`#commands get_project project_id: [ID]\` to see project details\n` +
								`• Use \`#commands list_sections project_id: [ID] suite_id: [SUITE_ID]\` to see test sections\n` +
								`• Use \`#commands create_text_test_case\` to create new test cases`,
						},
					],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `❌ **Error fetching projects:** ${error}\n\n🔧 **Troubleshooting:**\n• Check your TESTRAIL_URL is correct\n• Verify your TESTRAIL_API_KEY is valid\n• Ensure your user has project access permissions\n• Check if TestRail instance is accessible`,
						},
					],
				};
			}
		}
	);

	/**
	 * Get project details
	 */
	server.registerTool(
		"testrail_get_project",
		{
			description: "Get detailed information about a specific TestRail project including its test suites",
			inputSchema: {
				project_id: z.number().describe("The ID of the project to retrieve"),
			},
		},
		async ({ project_id }) => {
			try {
				const project = await clients.projects.getProject(project_id);
				const suitesResponse = await clients.suites.getSuites(project_id);

				// Ensure suites is an array
				const suitesArray = Array.isArray(suitesResponse) ? suitesResponse : [];

				const response = `## 🏗️ Project: ${project.name}\n\n` + `**ID:** ${project.id} | **Status:** ${project.is_completed ? "🔴 Completed" : "🟢 Active"}\n\n` + (project.announcement ? `**📢 Announcement:** ${project.announcement}\n\n` : "") + `### 🗂️ Test Suites (${suitesArray.length} total):\n\n` + (suitesArray.length > 0 ? suitesArray.map((suite: any) => `• **${suite.name}** (ID: ${suite.id})\n` + `  ${suite.description || "_No description provided_"}`).join("\n\n") : "No test suites found in this project.") + `\n\n💡 **Next steps:**\n` + `• Use \`#commands list_sections project_id: ${project_id} suite_id: [SUITE_ID]\` to explore sections\n` + `• Use \`#commands create_section suite_id: [SUITE_ID] name: "Section Name"\` to add sections\n` + `• Use \`#commands list_test_cases project_id: ${project_id} suite_id: [SUITE_ID] section_id: [SECTION_ID]\` to see test cases`;

				return {
					content: [
						{
							type: "text",
							text: response,
						},
					],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `❌ **Error fetching project:** ${error}\n\n🔧 **Troubleshooting:**\n• Check if project ID ${project_id} exists\n• Verify you have access to this project\n• Use \`#list_projects\` to see available projects`,
						},
					],
				};
			}
		}
	);

	/**
	 * List sections in a suite
	 */
	server.registerTool(
		"testrail_list_sections",
		{
			description: "Get all sections in a TestRail test suite",
			inputSchema: {
				project_id: z.number().describe("The ID of the project"),
				suite_id: z.number().describe("The ID of the suite to get sections from"),
			},
		},
		async ({ project_id, suite_id }) => {
			try {
				const sections = await clients.sections.getSections(project_id, suite_id);

				if (sections.length === 0) {
					return {
						content: [
							{
								type: "text",
								text: `No sections found in suite ${suite_id}.\n\n💡 **Tip:** Use \`#create_section suite_id: ${suite_id} name: "Section Name"\` to create a new section.`,
							},
						],
					};
				}

				// Build hierarchical section display
				const buildSectionHierarchy = (sections: any[], parentId: number | null = null, depth = 0): string => {
					const indent = "  ".repeat(depth);
					const emoji = depth === 0 ? "📂" : "📁";

					return sections
						.filter((s) => s.parent_id === parentId)
						.map((section) => {
							const children = buildSectionHierarchy(sections, section.id, depth + 1);
							return `${indent}${emoji} **${section.name}** (ID: ${section.id})\n${indent}     ${section.description || "Top-level section"}${children ? "\n" + children : ""}`;
						})
						.join("\n");
				};

				const hierarchy = buildSectionHierarchy(sections);

				return {
					content: [
						{
							type: "text",
							text: `Found ${sections.length} sections in suite ${suite_id}:\n\n${hierarchy}`,
						},
					],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `❌ **Error fetching sections:** ${error}\n\n🔧 **Troubleshooting:**\n• Check if project ID ${project_id} and suite ID ${suite_id} exist\n• Use \`#get_project project_id: ${project_id}\` to see available suites`,
						},
					],
				};
			}
		}
	);

	/**
	 * Get all priorities
	 */
	server.registerTool(
		"testrail_get_priorities",
		{
			description: "📊 Get all available test case priorities from TestRail with their IDs and names",
		},
		async () => {
			try {
				const priorities = await clients.priorities.getPriorities();

				if (priorities.length === 0) {
					return {
						content: [
							{
								type: "text",
								text: "🔍 **No priorities found**\n\nThis might indicate an issue with your TestRail configuration or permissions.",
							},
						],
					};
				}

				// Sort priorities by ID for consistent display
				const sortedPriorities = priorities.sort((a: any, b: any) => a.id - b.id);

				const priorityList = sortedPriorities
					.map((priority: any) => {
						const shortName = priority.short_name ? ` (Short: "${priority.short_name}")` : "";
						const isDefault = priority.is_default ? " ✅ Default" : "";
						return `- **${priority.name}** (ID: ${priority.id})${shortName}${isDefault}`;
					})
					.join("\n");

				return {
					content: [
						{
							type: "text",
							text: `# 📊 TestRail Priorities\n\n` + `Found **${priorities.length} priorities** in your TestRail instance:\n\n` + `${priorityList}\n\n` + `💡 **Usage Tips:**\n` + `• Use the ID number when updating test cases programmatically\n` + `• Use the short_name when using priority_short_name parameter\n` + `• Default priority is automatically assigned to new test cases`,
						},
					],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `❌ **Error fetching priorities:** ${error instanceof Error ? error.message : "Unknown error"}\n\n🔧 **Troubleshooting:**\n• Check your TestRail credentials and permissions\n• Ensure your TestRail instance is accessible`,
						},
					],
				};
			}
		}
	);

	/**
	 * Get available templates for a project
	 */
	server.registerTool(
		"testrail_get_templates",
		{
			description: "📐 Get available templates for a project - understand template options for better test case creation",
			inputSchema: {
				project_id: z.number().describe("Project ID to get templates for"),
			},
		},
		async ({ project_id }) => {
			try {
				const templates = await clients.projects.getTemplates(project_id);

				if (!templates || templates.length === 0) {
					return {
						content: [
							{
								type: "text",
								text: `📐 **No templates found for project ${project_id}**\n\n🔧 **Note:**\n• Templates are field layouts for test cases\n• Some projects may not have custom templates configured\n• Default templates are usually available but may not be listed`,
							},
						],
					};
				}

				const templateList = templates
					.map((template: any) => {
						const isDefault = template.is_default ? " ✅ Default" : "";
						return `- **${template.name}** (ID: ${template.id})${isDefault}`;
					})
					.join("\n");

				return {
					content: [
						{
							type: "text",
							text: `# 📐 TestRail Templates for Project ${project_id}\n\n` + `Found **${templates.length} templates** available:\n\n` + `${templateList}\n\n` + `💡 **Usage Tips:**\n` + `• Use template_id when creating test cases to specify field layout\n` + `• Templates control which custom fields are available\n` + `• Default template is used when template_id is not specified\n` + `• Templates require TestRail 5.2 or later`,
						},
					],
				};
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `❌ **Error fetching templates for project ${project_id}:** ${error instanceof Error ? error.message : "Unknown error"}\n\n🔧 **Troubleshooting:**\n• Verify the project ID is correct\n• Check your TestRail permissions for the project\n• Ensure your TestRail version supports templates (5.2+)`,
						},
					],
				};
			}
		}
	);
}
