import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailAPI } from "../testrail-api.js";

/**
 * Administrative and Dangerous Operations
 * These tools handle deleting, moving, copying, and bulk updates of test cases.
 * Use with extreme caution as some operations are irreversible.
 */
export function registerAdminTools(server: McpServer, api: TestRailAPI) {
	/**
	 * Delete test case with confirmation - CRITICAL OPERATION
	 */
	server.registerTool(
		"delete_test_case_confirmed",
		{
			description: "🚨 DELETE a test case from TestRail. This is IRREVERSIBLE! Use with extreme caution.",
			inputSchema: {
				case_id: z.number().describe("The ID of the test case to delete"),
				confirmation: z.literal("I_UNDERSTAND_THIS_IS_IRREVERSIBLE_DELETE").describe("Explicit confirmation for deletion"),
				reason: z.string().min(10).describe("Reason for deletion (minimum 10 characters) - required for audit purposes"),
			},
		},
		async ({ case_id, confirmation, reason }) => {
			let testCase: any = null;

			try {
				// First get the test case details to show what's being deleted
				testCase = await api.getCase(case_id);
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `❌ **Cannot retrieve test case ${case_id}**\n\n` + `Error: ${error instanceof Error ? error.message : "Unknown error"}\n\n` + `The test case may not exist or you may not have permission to view it.`,
						},
					],
				};
			}

			try {
				// Delete the test case - this may return empty response which is normal
				await api.deleteCase(case_id);

				return {
					content: [
						{
							type: "text",
							text: `# 🗑️ TEST CASE DELETED\n\n` + `**Deleted Test Case:**\n` + `- ID: ${testCase.id}\n` + `- Title: "${testCase.title}"\n` + `- Section: ${testCase.section_id}\n\n` + `**Deletion Details:**\n` + `- Timestamp: ${new Date().toISOString()}\n` + `- Reason: ${reason}\n\n` + `⚠️ **This action is IRREVERSIBLE!**\n` + `The test case has been permanently removed from TestRail.`,
						},
					],
				};
			} catch (error) {
				// Check if it's just a JSON parse error (which might mean successful deletion)
				if (error instanceof Error && error.message.includes("Unexpected end of JSON input")) {
					return {
						content: [
							{
								type: "text",
								text: `# 🗑️ TEST CASE LIKELY DELETED\n\n` + `**Deleted Test Case:**\n` + `- ID: ${testCase.id}\n` + `- Title: "${testCase.title}"\n` + `- Section: ${testCase.section_id}\n\n` + `**Deletion Details:**\n` + `- Timestamp: ${new Date().toISOString()}\n` + `- Reason: ${reason}\n\n` + `⚠️ **Note:** TestRail API returned empty response (normal for DELETE operations).\n` + `The test case has likely been successfully removed from TestRail.`,
							},
						],
					};
				}

				return {
					content: [
						{
							type: "text",
							text: `❌ **Failed to delete test case ${case_id}**\n\n` + `Error: ${error instanceof Error ? error.message : "Unknown error"}\n\n` + `The test case may not exist or you may not have permission to delete it.`,
						},
					],
				};
			}
		}
	);

	/**
	 * Copy test cases to another section
	 */
	server.registerTool(
		"copy_test_cases",
		{
			description: "📋 Copy test cases to another section (creates duplicates, originals remain)",
			inputSchema: {
				case_ids: z.array(z.number()).describe("Array of test case IDs to copy"),
				target_section_id: z.number().describe("Target section ID where cases will be copied"),
				confirmation: z.literal("I_UNDERSTAND_THIS_CREATES_DUPLICATES").describe("Confirmation that you understand this creates duplicates"),
			},
		},
		async ({ case_ids, target_section_id, confirmation }) => {
			const results = [];
			let successCount = 0;
			let errorCount = 0;

			for (const caseId of case_ids) {
				try {
					// Get the original case
					const originalCase = await api.getCase(caseId);

					// Create a copy in the target section
					const copiedCase = await api.addCase(target_section_id, {
						title: `${originalCase.title} (Copy)`,
						type_id: originalCase.type_id,
						priority_id: originalCase.priority_id,
						estimate: originalCase.estimate,
						refs: originalCase.refs,
						custom_preconds: originalCase.custom_preconds,
						custom_steps: originalCase.custom_steps,
						custom_expected: originalCase.custom_expected,
						custom_steps_separated: originalCase.custom_steps_separated,
						custom_mission: originalCase.custom_mission,
						custom_goals: originalCase.custom_goals,
					});

					results.push(`✅ Copied case ${caseId}: "${originalCase.title}" → ID: ${copiedCase.id}`);
					successCount++;
				} catch (error) {
					results.push(`❌ Failed to copy case ${caseId}: ${error instanceof Error ? error.message : "Unknown error"}`);
					errorCount++;
				}
			}

			return {
				content: [
					{
						type: "text",
						text: `# 📋 COPY OPERATION COMPLETED\n\n` + `**Summary:**\n` + `✅ Successfully copied: ${successCount} test cases\n` + `❌ Failed: ${errorCount} test cases\n\n` + `**Target Section:** ${target_section_id}\n\n` + `**Details:**\n${results.join("\n")}\n\n` + `💡 **Note:** Original test cases remain unchanged. Copies were created with "(Copy)" suffix.`,
					},
				],
			};
		}
	);

	/**
	 * Move test cases to another section/suite
	 */
	server.registerTool(
		"move_test_cases",
		{
			description: "🚛 Move test cases to another section/suite (removes from original location)",
			inputSchema: {
				case_ids: z.array(z.number()).describe("Array of test case IDs to move"),
				target_section_id: z.number().describe("Target section ID where cases will be moved"),
				target_suite_id: z.number().describe("Target suite ID where cases will be moved"),
				confirmation: z.literal("I_UNDERSTAND_THIS_MOVES_CASES_PERMANENTLY").describe("Confirmation that you understand this moves cases permanently"),
			},
		},
		async ({ case_ids, target_section_id, target_suite_id, confirmation }) => {
			const results = [];
			let successCount = 0;
			let errorCount = 0;

			for (const caseId of case_ids) {
				try {
					// Update the case's section
					await api.updateCase(caseId, {
						section_id: target_section_id,
					});

					results.push(`✅ Moved case ${caseId} to section ${target_section_id}`);
					successCount++;
				} catch (error) {
					results.push(`❌ Failed to move case ${caseId}: ${error instanceof Error ? error.message : "Unknown error"}`);
					errorCount++;
				}
			}

			return {
				content: [
					{
						type: "text",
						text: `# 🚛 MOVE OPERATION COMPLETED\n\n` + `**Summary:**\n` + `✅ Successfully moved: ${successCount} test cases\n` + `❌ Failed: ${errorCount} test cases\n\n` + `**Target Location:**\n` + `- Suite ID: ${target_suite_id}\n` + `- Section ID: ${target_section_id}\n\n` + `**Details:**\n${results.join("\n")}\n\n` + `💡 **Note:** Test cases have been permanently moved from their original location.`,
					},
				],
			};
		}
	);

	/**
	 * Batch update test cases
	 */
	server.registerTool(
		"update_test_cases_batch",
		{
			description: "🔄 Update multiple test cases with the same values (e.g., change priority for multiple cases)",
			inputSchema: {
				suite_id: z.number().describe("Suite ID containing the test cases"),
				case_ids: z.array(z.number()).describe("Array of test case IDs to update"),
				updates: z
					.object({
						priority_id: z.number().optional().describe("New priority ID - use get_case_metadata to see valid IDs"),
						priority_short_name: z.string().optional().describe("New priority short name (e.g., '3' for '3 - Must Test')"),
						type_id: z.number().optional().describe("New case type ID"),
						estimate: z.string().optional().describe("New time estimate (e.g., '30m', '1h 30m')"),
						milestone_id: z.number().optional().describe("New milestone ID"),
						refs: z.string().optional().describe("New references/requirements"),
					})
					.describe("Fields to update with new values"),
				confirmation: z.literal("I_HAVE_REVIEWED_THE_CASE_IDS_TO_UPDATE").describe("Confirmation that you have reviewed the case IDs"),
			},
		},
		async ({ suite_id, case_ids, updates, confirmation }) => {
			const results = [];
			let successCount = 0;
			let errorCount = 0;

			// Resolve priority_short_name to priority_id if provided
			let finalUpdates = { ...updates };
			if (updates.priority_short_name) {
				try {
					const priority = await api.getPriorityByShortName(updates.priority_short_name);
					if (priority) {
						finalUpdates.priority_id = priority.id;
						delete finalUpdates.priority_short_name;
					} else {
						return {
							content: [
								{
									type: "text",
									text: `❌ **Priority short name "${updates.priority_short_name}" not found**\n\nAvailable priorities can be viewed with get_case_metadata tool.`,
								},
							],
						};
					}
				} catch (error) {
					return {
						content: [
							{
								type: "text",
								text: `❌ **Failed to resolve priority short name "${updates.priority_short_name}"**\n\nError: ${error instanceof Error ? error.message : "Unknown error"}`,
							},
						],
					};
				}
			}

			// Build update summary
			const updateSummary = Object.entries(finalUpdates)
				.filter(([, value]) => value !== undefined)
				.map(([key, value]) => {
					if (key === "priority_id") {
						return `Priority ID → ${value}`;
					}
					return `${key} → ${value}`;
				})
				.join(", ");

			for (const caseId of case_ids) {
				try {
					await api.updateCase(caseId, finalUpdates);
					results.push(`✅ Updated case ${caseId}`);
					successCount++;
				} catch (error) {
					results.push(`❌ Failed to update case ${caseId}: ${error instanceof Error ? error.message : "Unknown error"}`);
					errorCount++;
				}
			}

			return {
				content: [
					{
						type: "text",
						text: `# 🔄 BATCH UPDATE COMPLETED\n\n` + `**Summary:**\n` + `✅ Successfully updated: ${successCount} test cases\n` + `❌ Failed: ${errorCount} test cases\n\n` + `**Updates Applied:** ${updateSummary}\n` + `**Suite ID:** ${suite_id}\n\n` + `**Details:**\n${results.join("\n")}\n\n` + `💡 **Note:** Changes have been applied to all successfully updated test cases.`,
					},
				],
			};
		}
	);
}
