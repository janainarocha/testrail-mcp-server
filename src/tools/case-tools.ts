import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailAPI } from "../testrail-api.js";

/**
 * Individual Test Case Creation Tools
 * These tools create single test cases with specific types and structures.
 */
export function registerCaseTools(server: McpServer, api: TestRailAPI) {
	/**
	 * Create a text-based test case
	 */
	server.registerTool(
		"create_text_test_case",
		{
			description: "Create a new text-based test case in TestRail",
			inputSchema: {
				title: z.string().describe("The title/name of the test case"),
				section_id: z.number().describe("The section ID where the test case should be created"),
				description: z.string().optional().describe("Test case description"),
				preconditions: z.string().optional().describe("Preconditions for the test"),
				expected_result: z.string().optional().describe("Expected result/behavior"),
				priority_id: z.number().min(1).max(4).default(2).describe("Priority: 1=Low, 2=Medium, 3=High, 4=Critical"),
				estimate: z.string().optional().describe("Time estimate (e.g., '1m', '5m', '1h')"),
			},
		},
		async ({ title, section_id, description, preconditions, expected_result, priority_id, estimate }) => {
			const testCase = {
				title,
				type_id: 1, // Text type
				priority_id,
				estimate,
				refs: undefined,
				custom_preconds: preconditions,
				custom_steps: description,
				custom_expected: expected_result,
			};

			const createdCase = await api.addCase(section_id, testCase);

			return {
				content: [
					{
						type: "text",
						text: `✅ Successfully created text test case!\n\n` + `**${createdCase.title}** (ID: ${createdCase.id})\n` + `Section: ${section_id}\n` + `Type: Text\n` + `Priority: ${priority_id === 1 ? "Low" : priority_id === 2 ? "Medium" : priority_id === 3 ? "High" : "Critical"}\n` + `${estimate ? `Estimate: ${estimate}\n` : ""}` + `${description ? `Description: ${description}\n` : ""}` + `${preconditions ? `Preconditions: ${preconditions}\n` : ""}` + `${expected_result ? `Expected Result: ${expected_result}` : ""}`,
					},
				],
			};
		}
	);

	/**
	 * Create a steps-based test case
	 */
	server.registerTool(
		"create_steps_test_case",
		{
			description: "Create a new steps-based test case in TestRail with structured test steps",
			inputSchema: {
				title: z.string().describe("The title/name of the test case"),
				section_id: z.number().describe("The section ID where the test case should be created"),
				description: z.string().optional().describe("Test case description"),
				preconditions: z.string().optional().describe("Preconditions for the test"),
				steps: z
					.array(
						z.object({
							content: z.string().describe("The action/step to perform"),
							expected: z.string().describe("Expected result for this step"),
						})
					)
					.describe("Array of test steps with actions and expected results"),
				priority_id: z.number().min(1).max(4).optional().describe("Priority: 1=Low, 2=Medium, 3=High, 4=Critical"),
				estimate: z.string().optional().describe("Time estimate (e.g., '1m', '5m', '1h')"),
			},
		},
		async ({ title, section_id, description, preconditions, steps, priority_id, estimate }) => {
			const testCase: any = {
				title,
				type_id: 2, // Steps type
				estimate,
				custom_preconds: preconditions,
				custom_steps: description,
				custom_steps_separated: steps,
			};

			// Remove any undefined fields
			Object.keys(testCase).forEach((key) => {
				if (testCase[key] === undefined) {
					delete testCase[key];
				}
			});

			const createdCase = await api.addCase(section_id, testCase);

			return {
				content: [
					{
						type: "text",
						text: `✅ Successfully created steps test case!\n\n` + `**${createdCase.title}** (ID: ${createdCase.id})\n` + `Section: ${section_id}\n` + `Type: Steps\n` + `Priority: ${priority_id === 1 ? "Low" : priority_id === 2 ? "Medium" : priority_id === 3 ? "High" : "Critical"}\n` + `${estimate ? `Estimate: ${estimate}\n` : ""}` + `${description ? `Description: ${description}\n` : ""}` + `${preconditions ? `Preconditions: ${preconditions}\n` : ""}` + `\n**Test Steps:**\n` + steps.map((step, i) => `${i + 1}. **Action:** ${step.content}\n` + `   **Expected:** ${step.expected}`).join("\n"),
					},
				],
			};
		}
	);

	/**
	 * Create an exploratory test case
	 */
	server.registerTool(
		"create_exploratory_test_case",
		{
			description: "Create a new exploratory test case in TestRail",
			inputSchema: {
				title: z.string().describe("The title/name of the test case"),
				section_id: z.number().describe("The section ID where the test case should be created"),
				description: z.string().optional().describe("Test case description"),
				preconditions: z.string().optional().describe("Preconditions for the test"),
				mission: z.string().optional().describe("The testing mission/goal for exploration"),
				priority_id: z.number().min(1).max(4).default(2).describe("Priority: 1=Low, 2=Medium, 3=High, 4=Critical"),
				estimate: z.string().optional().describe("Time estimate (e.g., '1m', '5m', '1h')"),
			},
		},
		async ({ title, section_id, description, preconditions, mission, priority_id, estimate }) => {
			const testCase = {
				title,
				type_id: 3, // Exploratory type
				priority_id,
				estimate,
				refs: undefined,
				custom_preconds: preconditions,
				custom_steps: description,
				custom_mission: mission,
			};

			const createdCase = await api.addCase(section_id, testCase);

			return {
				content: [
					{
						type: "text",
						text: `✅ Successfully created exploratory test case!\n\n` + `**${createdCase.title}** (ID: ${createdCase.id})\n` + `Section: ${section_id}\n` + `Type: Exploratory\n` + `Priority: ${priority_id === 1 ? "Low" : priority_id === 2 ? "Medium" : priority_id === 3 ? "High" : "Critical"}\n` + `${estimate ? `Estimate: ${estimate}\n` : ""}` + `${description ? `Description: ${description}\n` : ""}` + `${preconditions ? `Preconditions: ${preconditions}\n` : ""}` + `${mission ? `Mission: ${mission}` : ""}`,
					},
				],
			};
		}
	);

	/**
	 * Create a new section
	 */
	server.registerTool(
		"create_section",
		{
			description: "Create a new section in a TestRail test suite",
			inputSchema: {
				suite_id: z.number().describe("The ID of the suite where the section should be created"),
				name: z.string().describe("The name of the new section"),
				description: z.string().optional().describe("Description of the section"),
				parent_id: z.number().optional().describe("Parent section ID if creating a subsection"),
			},
		},
		async ({ suite_id, name, description, parent_id }) => {
			const section = await api.addSectionLegacy(suite_id, name, suite_id, parent_id);

			return {
				content: [
					{
						type: "text",
						text: `✅ Successfully created section!\n\n` + `**${section.name}** (ID: ${section.id})\n` + `Suite: ${suite_id}\n` + `${description ? `Description: ${description}\n` : ""}` + `${parent_id ? `Parent Section: ${parent_id}` : "Top-level section"}`,
					},
				],
			};
		}
	);

	/**
	 * Get test case details
	 */
	server.registerTool(
		"get_test_case",
		{
			description: "Get detailed information about a specific test case",
			inputSchema: {
				case_id: z.number().describe("The ID of the test case to retrieve"),
			},
		},
		async ({ case_id }) => {
			const testCase = await api.getCase(case_id);

			return {
				content: [
					{
						type: "text",
						text: `📋 Test Case Details\n\n` + `**${testCase.title}** (ID: ${testCase.id})\n` + `Type: ${testCase.type_id === 1 ? "Text" : testCase.type_id === 2 ? "Steps" : testCase.type_id === 3 ? "Exploratory" : "Other"}\n` + `Priority: ${testCase.priority_id === 1 ? "Low" : testCase.priority_id === 2 ? "Medium" : testCase.priority_id === 3 ? "High" : testCase.priority_id === 4 ? "Critical" : "Unknown"}\n` + `Section: ${testCase.section_id}\n` + `${testCase.estimate ? `Estimate: ${testCase.estimate}\n` : ""}` + `${testCase.refs ? `References: ${testCase.refs}\n` : ""}` + `${testCase.custom_preconds ? `\n**Preconditions:**\n${testCase.custom_preconds}\n` : ""}` + `${testCase.custom_steps ? `\n**Steps/Description:**\n${testCase.custom_steps}\n` : ""}` + `${testCase.custom_expected ? `\n**Expected Result:**\n${testCase.custom_expected}\n` : ""}` + `${testCase.custom_mission ? `\n**Mission:**\n${testCase.custom_mission}\n` : ""}`,
					},
				],
			};
		}
	);

	/**
	 * List test cases in a section
	 */
	server.registerTool(
		"list_test_cases",
		{
			description: "Get all test cases in a specific section of a TestRail suite",
			inputSchema: {
				project_id: z.number().describe("The ID of the project"),
				suite_id: z.number().describe("The ID of the suite"),
				section_id: z.number().describe("The ID of the section to get test cases from"),
			},
		},
		async ({ project_id, suite_id, section_id }) => {
			const testCases = await api.getCases(project_id, suite_id, section_id);

			if (!testCases || testCases.length === 0) {
				return {
					content: [
						{
							type: "text",
							text: `📄 No test cases found in section ${section_id}`,
						},
					],
				};
			}

			const casesList = testCases
				.map((testCase: any) => {
					const priority = testCase.priority_id === 1 ? "Low" : testCase.priority_id === 2 ? "Medium" : testCase.priority_id === 3 ? "High" : testCase.priority_id === 4 ? "Critical" : "Unknown";
					const type = testCase.type_id === 1 ? "Text" : testCase.type_id === 2 ? "Steps" : testCase.type_id === 3 ? "Exploratory" : "Other";
					return `• **${testCase.title}** (ID: ${testCase.id})\n  Type: ${type} | Priority: ${priority}${testCase.estimate ? ` | Est: ${testCase.estimate}` : ""}`;
				})
				.join("\n");

			return {
				content: [
					{
						type: "text",
						text: `📋 Test Cases in Section ${section_id}\n\n${casesList}\n\n**Total:** ${testCases.length} test cases`,
					},
				],
			};
		}
	);
}
