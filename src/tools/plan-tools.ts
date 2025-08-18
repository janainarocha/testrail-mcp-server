import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailPlansAPI } from "../api/testrail-plans.js";
import { z } from "zod";

/**
 * Plan Tools
 * Tools for retrieving and managing test plans in TestRail.
 */

export function registerPlanTools(server: McpServer, clients: { plans: TestRailPlansAPI }) {
	/**
	 * Get test plan details by ID
	 */
	server.registerTool(
		"testrail_get_plan",
		{
			description: "Returns an existing test plan by ID.",
			inputSchema: {
				plan_id: z.number().positive().describe("The ID of the test plan."),
			},
		},
		async ({ plan_id }) => {
			try {
				const plan = await clients.plans.getPlan(plan_id);
				return {
					content: [{ type: "text", text: JSON.stringify(plan, null, 2) }],
				};
			} catch (error: any) {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({ error: error.message || "Unknown error", details: "Failed to get plan" }, null, 2),
						},
					],
				};
			}
		}
	);
	/**
	 * Get test plans for a project (with filters)
	 */
	server.registerTool(
		"testrail_get_plans",
		{
			description: "Returns a list of test plans for a project.",
			inputSchema: {
				project_id: z.number().positive().describe("The ID of the project."),
				created_after: z.number().optional().describe("Only return test plans created after this date (as UNIX timestamp)."),
				created_before: z.number().optional().describe("Only return test plans created before this date (as UNIX timestamp)."),
				created_by: z
					.union([z.number(), z.array(z.number())])
					.optional()
					.describe("A comma-separated list of creators (user IDs) to filter by."),
				is_completed: z.boolean().optional().describe("1 to return completed test plans only. 0 to return active test plans only."),
				limit: z.number().positive().optional().describe("Limit the result to :limit test plans."),
				offset: z.number().min(0).optional().describe("Use :offset to skip records."),
				milestone_id: z
					.union([z.number(), z.array(z.number())])
					.optional()
					.describe("A comma-separated list of milestone IDs to filter by."),
			},
		},
		async ({ project_id, created_after, created_before, created_by, is_completed, limit, offset, milestone_id }) => {
			try {
				const plans = await clients.plans.getPlans(project_id, {
					created_after,
					created_before,
					created_by,
					is_completed,
					limit,
					offset,
					milestone_id,
				});
				return {
					content: [{ type: "text", text: JSON.stringify(plans, null, 2) }],
				};
			} catch (error: any) {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({ error: error.message || "Unknown error", details: "Failed to get plans" }, null, 2),
						},
					],
				};
			}
		}
	);
	/**
	 * Add a new test run to a test plan entry (TestRail 6.4+)
	 */
	server.registerTool(
		"testrail_add_run_to_plan_entry",
		{
			description: "Adds a new test run to a test plan entry (TestRail 6.4+).",
			inputSchema: {
				plan_id: z.number().positive().describe("The ID of the plan the test runs should be added to."),
				entry_id: z.string().describe("The ID of the test plan entry."),
				config_ids: z.array(z.number()).describe("An array of configuration IDs used for the test run of the test plan entry."),
				description: z.string().optional().describe("The description of the test run."),
				assignedto_id: z.number().optional().describe("The ID of the user the test run should be assigned to."),
				start_on: z.number().optional().describe("The start date of a test plan as UNIX timestamp."),
				due_on: z.number().optional().describe("The end date of a test plan as UNIX timestamp."),
				include_all: z.boolean().optional().describe("True for including all test cases of the test suite and false for a custom case selection."),
				entries: z
					.array(
						z.object({
							suite_id: z.number(),
							name: z.string().optional(),
							assignedto_id: z.number().optional(),
							include_all: z.boolean().optional(),
							case_ids: z.array(z.number()).optional(),
							config_ids: z.array(z.number()).optional(),
							runs: z
								.array(
									z.object({
										include_all: z.boolean().optional(),
										case_ids: z.array(z.number()).optional(),
										assignedto_id: z.number().optional(),
										config_ids: z.array(z.number()).optional(),
									})
								)
								.optional(),
						})
					)
					.optional()
					.describe("An array of objects describing the test runs of the plan."),
				refs: z.string().optional().describe("A comma-separated list of references/requirements."),
			},
		},
		async ({ plan_id, entry_id, ...data }) => {
			try {
				const run = await clients.plans.addRunToPlanEntry(plan_id, entry_id, data);
				return {
					content: [{ type: "text", text: JSON.stringify(run, null, 2) }],
				};
			} catch (error: any) {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({ error: error.message || "Unknown error", details: "Failed to add run to plan entry" }, null, 2),
						},
					],
				};
			}
		}
	);

	/**
	 * Update an existing test plan (partial updates supported)
	 */
	server.registerTool(
		"testrail_update_plan",
		{
			description: "Updates an existing test plan (partial updates supported).",
			inputSchema: {
				plan_id: z.number().positive().describe("The ID of the test plan."),
				name: z.string().optional().describe("The name of the test plan."),
				description: z.string().optional().describe("The description of the test plan."),
				milestone_id: z.number().optional().describe("The ID of the milestone to link to the test plan."),
				start_on: z.number().optional().describe("The start date of a test plan as UNIX timestamp."),
				due_on: z.number().optional().describe("The end date of a test plan as UNIX timestamp."),
				refs: z.string().optional().describe("A comma-separated list of references/requirements."),
			},
		},
		async ({ plan_id, ...data }) => {
			try {
				const plan = await clients.plans.updatePlan(plan_id, data);
				return {
					content: [{ type: "text", text: JSON.stringify(plan, null, 2) }],
				};
			} catch (error: any) {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({ error: error.message || "Unknown error", details: "Failed to update plan" }, null, 2),
						},
					],
				};
			}
		}
	);

	/**
	 * Update one or more groups of test runs in a plan (partial updates supported)
	 */
	server.registerTool(
		"testrail_update_plan_entry",
		{
			description: "Updates one or more groups of test runs in a plan (partial updates supported).",
			inputSchema: {
				plan_id: z.number().positive().describe("The ID of the test plan."),
				entry_id: z.string().describe("The ID of the test plan entry."),
				name: z.string().optional().describe("The name of the test run(s)."),
				description: z.string().optional().describe("The description of the test run(s)."),
				assignedto_id: z.number().optional().describe("The ID of the user the test run should be assigned to."),
				start_on: z.number().optional().describe("The start date of a test plan as UNIX timestamp."),
				due_on: z.number().optional().describe("The end date of a test plan as UNIX timestamp."),
				include_all: z.boolean().optional().describe("True for including all test cases of the test suite and false for a custom case selection."),
				case_ids: z.array(z.number()).optional().describe("An array of case IDs for the custom case selection."),
				refs: z.string().optional().describe("A string of external requirement IDs, separated by commas."),
			},
		},
		async ({ plan_id, entry_id, ...data }) => {
			try {
				const entry = await clients.plans.updatePlanEntry(plan_id, entry_id, data);
				return {
					content: [{ type: "text", text: JSON.stringify(entry, null, 2) }],
				};
			} catch (error: any) {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({ error: error.message || "Unknown error", details: "Failed to update plan entry" }, null, 2),
						},
					],
				};
			}
		}
	);

	/**
	 * Update a run inside a plan entry that uses configurations (TestRail 6.4+)
	 */
	server.registerTool(
		"testrail_update_run_in_plan_entry",
		{
			description: "Updates a run inside a plan entry that uses configurations (TestRail 6.4+).",
			inputSchema: {
				run_id: z.number().positive().describe("The ID of the test run."),
				description: z.string().optional().describe("The description of the test run."),
				assignedto_id: z.number().optional().describe("The ID of the user the test run should be assigned to."),
				start_on: z.number().optional().describe("The start date of a test plan as UNIX timestamp."),
				due_on: z.number().optional().describe("The end date of a test plan as UNIX timestamp."),
				include_all: z.boolean().optional().describe("True for including all test cases of the test suite and false for a custom case selection."),
				case_ids: z.array(z.number()).optional().describe("An array of case IDs for the custom case selection."),
				refs: z.string().optional().describe("A string of external requirement IDs, separated by commas."),
			},
		},
		async ({ run_id, ...data }) => {
			try {
				const run = await clients.plans.updateRunInPlanEntry(run_id, data);
				return {
					content: [{ type: "text", text: JSON.stringify(run, null, 2) }],
				};
			} catch (error: any) {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({ error: error.message || "Unknown error", details: "Failed to update run in plan entry" }, null, 2),
						},
					],
				};
			}
		}
	);

	/**
	 * Close an existing test plan
	 */
	server.registerTool(
		"testrail_close_plan",
		{
			description: "Closes an existing test plan and archives its test runs & results.",
			inputSchema: {
				plan_id: z.number().positive().describe("The ID of the test plan."),
			},
		},
		async ({ plan_id }) => {
			try {
				const plan = await clients.plans.closePlan(plan_id);
				return {
					content: [{ type: "text", text: JSON.stringify(plan, null, 2) }],
				};
			} catch (error: any) {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({ error: error.message || "Unknown error", details: "Failed to close plan" }, null, 2),
						},
					],
				};
			}
		}
	);
}
