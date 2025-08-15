import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailAPI } from "../testrail-api.js";

/**
 * Batch Operations and Preview Tools
 * These tools handle bulk operations like creating multiple test cases from user stories.
 */
export function registerBatchTools(server: McpServer, api: TestRailAPI) {
	/**
	 * Create test cases batch with confirmation - REQUIRES PREVIEW FIRST
	 */
	server.registerTool(
		"create_test_cases_batch_confirmed",
		{
			description: "✅ Create multiple test cases with full TestRail API support.",
			inputSchema: {
				project_id: z.number().describe("Project ID"),
				section_id: z.number().describe("Section ID where test cases will be created"),
				test_cases: z
					.array(
						z.object({
							// Required fields
							title: z.string().describe("The title of the test case (REQUIRED)"),

							// Optional TestRail API fields
							template_id: z.number().optional().describe("The ID of the template (field layout)—requires TestRail 5.2 or later"),
							type_id: z.number().optional().describe("The ID of the case type"),
							priority_id: z.number().optional().describe("The ID of the case priority"),
							estimate: z.string().optional().describe("The estimate, e.g. '30s' or '1m 45s'"),
							milestone_id: z.number().optional().describe("The ID of the milestone to link to the test case"),
							refs: z.string().optional().describe("A comma-separated list of references/requirements"),
							labels: z
								.array(z.union([z.number(), z.string()]))
								.optional()
								.describe("Array of label IDs or titles"),

							// Custom fields for different test case types
							custom_preconds: z.string().optional().describe("Test preconditions"),
							custom_steps: z.string().optional().describe("Test steps (plain text)"),
							custom_expected: z.string().optional().describe("Expected result"),
							custom_steps_separated: z
								.array(
									z.object({
										content: z.string().describe("Step action"),
										expected: z.string().describe("Expected result"),
									})
								)
								.optional()
								.describe("Structured test steps"),
							custom_mission: z.string().optional().describe("Mission (for exploratory tests)Test with all API parameters"),
							custom_goals: z.string().optional().describe("Goals (for exploratory tests)"),
						})
					)
					.describe("Array of test cases to create"),
				selected_indexes: z.array(z.number()).optional().describe("Optional: specific indexes to create (1-based). If not provided, creates all test cases."),
				confirmation: z.literal("I_HAVE_REVIEWED_AND_CONFIRM_CREATION").describe("Explicit confirmation that user has reviewed the test cases"),
			},
		},
		async ({ project_id, section_id, test_cases, selected_indexes, confirmation }) => {
			// Filter test cases if specific indexes are selected
			const casesToCreate = selected_indexes ? selected_indexes.map((index) => test_cases[index - 1]).filter(Boolean) : test_cases;

			const results = [];
			let successCount = 0;
			let errorCount = 0;

			for (const [arrayIndex, tc] of casesToCreate.entries()) {
				const originalIndex = selected_indexes ? selected_indexes[arrayIndex] : arrayIndex + 1;

				try {
					// Create test case with all provided fields - pass directly to TestRail API
					const caseData: any = {
						title: tc.title,
					};

					// Add optional TestRail API fields if provided
					if (tc.template_id !== undefined) caseData.template_id = tc.template_id;
					if (tc.type_id !== undefined) caseData.type_id = tc.type_id;
					if (tc.priority_id !== undefined) caseData.priority_id = tc.priority_id;
					if (tc.estimate !== undefined) caseData.estimate = tc.estimate;
					if (tc.milestone_id !== undefined) caseData.milestone_id = tc.milestone_id;
					if (tc.refs !== undefined) caseData.refs = tc.refs;
					if (tc.labels !== undefined) caseData.labels = tc.labels;

					// Add custom fields if provided
					if (tc.custom_preconds !== undefined) caseData.custom_preconds = tc.custom_preconds;
					if (tc.custom_steps !== undefined) caseData.custom_steps = tc.custom_steps;
					if (tc.custom_expected !== undefined) caseData.custom_expected = tc.custom_expected;
					if (tc.custom_steps_separated !== undefined) caseData.custom_steps_separated = tc.custom_steps_separated;
					if (tc.custom_mission !== undefined) caseData.custom_mission = tc.custom_mission;
					if (tc.custom_goals !== undefined) caseData.custom_goals = tc.custom_goals;

					const createdCase = await api.addCase(section_id, caseData);

					if (createdCase && createdCase.id) {
						results.push(`✅ Created (#${originalIndex}): "${tc.title}" (ID: ${createdCase.id})`);
						successCount++;
					} else {
						results.push(`❌ Failed (#${originalIndex}): "${tc.title}" - No response from TestRail`);
						errorCount++;
					}
				} catch (error) {
					results.push(`❌ Failed (#${originalIndex}): "${tc.title}" - ${error instanceof Error ? error.message : "Unknown error"}`);
					errorCount++;
				}
			}

			const selectionInfo = selected_indexes ? ` (Selected: ${selected_indexes.join(", ")})` : " (All)";

			return {
				content: [
					{
						type: "text",
						text: `# 🎉 BATCH CREATION COMPLETED${selectionInfo}\n\n` + `**Summary:**\n` + `✅ Successfully created: ${successCount} test cases\n` + `❌ Failed: ${errorCount} test cases\n\n` + `**Details:**\n${results.join("\n")}\n\n` + `${successCount > 0 ? "🔗 Test cases are now available in TestRail!" : ""}` + `${errorCount > 0 ? "\n\n⚠️ Some test cases failed to create. Please check the error messages above." : ""}`,
					},
				],
			};
		}
	);
}

// Helper function to generate test cases from user story
function generateTestCasesFromUserStory(userStory: string, technicalDetails?: string): any[] {
	// This is a simplified version - in a real implementation you could use AI/LLM to generate more sophisticated test cases
	const testCases = [];

	// Extract key components from user story
	const storyLower = userStory.toLowerCase();
	const isAPI = storyLower.includes("api") || storyLower.includes("endpoint") || storyLower.includes("service");
	const isDB = storyLower.includes("database") || storyLower.includes("table") || storyLower.includes("column");
	const isUI = storyLower.includes("ui") || storyLower.includes("interface") || storyLower.includes("form");
	const isValidation = storyLower.includes("validation") || storyLower.includes("validate") || storyLower.includes("required");

	// Generate happy path test
	testCases.push({
		title: `${userStory} - Happy Path Test`,
		type: "steps",
		priority: "high",
		steps_separated: [
			{ content: "Set up test environment with valid data", expected: "Environment ready for testing" },
			{ content: "Execute main functionality according to user story", expected: "Feature works as expected" },
			{ content: "Verify all expected outcomes", expected: "All requirements met successfully" },
		],
	});

	// Generate validation test if needed
	if (isValidation) {
		testCases.push({
			title: `${userStory} - Input Validation Test`,
			type: "steps",
			priority: "high",
			steps_separated: [
				{ content: "Test with invalid/missing required data", expected: "Appropriate validation errors shown" },
				{ content: "Test with boundary values", expected: "System handles edge cases correctly" },
				{ content: "Test with valid data", expected: "Validation passes and process continues" },
			],
		});
	}

	// Generate database test if needed
	if (isDB) {
		testCases.push({
			title: `${userStory} - Database Integration Test`,
			type: "steps",
			priority: "high",
			steps_separated: [
				{ content: "Connect to database and verify schema", expected: "Database connection established" },
				{ content: "Execute database operations as per story", expected: "Data operations complete successfully" },
				{ content: "Verify data integrity and constraints", expected: "All database constraints maintained" },
			],
		});
	}

	// Generate error handling test
	testCases.push({
		title: `${userStory} - Error Handling Test`,
		type: "steps",
		priority: "medium",
		steps_separated: [
			{ content: "Simulate error conditions", expected: "Errors are caught appropriately" },
			{ content: "Verify error messages are user-friendly", expected: "Clear error messages displayed" },
			{ content: "Test system recovery", expected: "System recovers gracefully from errors" },
		],
	});

	return testCases;
}
