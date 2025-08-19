import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailRunsAPI } from "../api/testrail-runs.js";
import { z } from "zod";

/**
 * Run Tools
 * Tools for managing test runs in TestRail.
 */

export function registerRunTools(server: McpServer, clients: { runs: TestRailRunsAPI }) {
	/**
	 * Get a specific test run
	 */
	server.registerTool(
		"testrail_get_run",
		{
			description: "Get a specific test run by ID with complete details including test counts and configuration",
			inputSchema: {
				run_id: z.number().positive().describe("The ID of the test run")
			},
		},
		async ({ run_id }) => {
			try {
				const run = await clients.runs.getRun(run_id);

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(run, null, 2)
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
								run_id,
								details: "Failed to get test run"
							}, null, 2)
						}
					]
				};
			}
		}
	);

	/**
	 * Get test runs for a project
	 */
	server.registerTool(
		"testrail_get_runs",
		{
			description: "Get test runs for a project with optional filtering and pagination - returns runs not part of test plans",
			inputSchema: {
				project_id: z.number().positive().describe("The ID of the project"),
				created_after: z.number().optional().describe("Only return test runs created after this date (UNIX timestamp)"),
				created_before: z.number().optional().describe("Only return test runs created before this date (UNIX timestamp)"),
				created_by: z.array(z.number()).optional().describe("Array of creator user IDs to filter by"),
				is_completed: z.boolean().optional().describe("True to return completed runs only, false for active runs only"),
				limit: z.number().positive().max(250).optional().describe("The number of test runs to return (max 250)"),
				offset: z.number().min(0).optional().describe("The number of records to skip"),
				milestone_id: z.array(z.number()).optional().describe("Array of milestone IDs to filter by"),
				refs_filter: z.string().optional().describe("A single Reference ID (e.g. TR-a, 4291, etc.)"),
				suite_id: z.array(z.number()).optional().describe("Array of test suite IDs to filter by")
			},
		},
		async ({ project_id, ...options }) => {
			try {
				const runs = await clients.runs.getRuns(project_id, options);

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(runs, null, 2)
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
								project_id,
								details: "Failed to get test runs"
							}, null, 2)
						}
					]
				};
			}
		}
	);

	/**
	 * Create a new test run
	 */
	server.registerTool(
		"testrail_add_run",
		{
			description: "Create a new test run in a project with custom case selection and configuration options",
			inputSchema: {
				project_id: z.number().positive().describe("The ID of the project the test run should be added to"),
				suite_id: z.number().positive().optional().describe("The ID of the test suite (required for multi-suite projects)"),
				name: z.string().min(1).describe("The name of the test run"),
				description: z.string().optional().describe("The description of the test run"),
				milestone_id: z.number().positive().optional().describe("The ID of the milestone to link to the test run"),
				assignedto_id: z.number().positive().optional().describe("The ID of the user the test run should be assigned to"),
				include_all: z.boolean().optional().describe("True to include all test cases, false for custom selection (default: true)"),
				case_ids: z.array(z.number().positive()).optional().describe("Array of case IDs for custom case selection (when include_all is false)"),
				refs: z.string().optional().describe("Comma-separated list of references/requirements"),
				start_on: z.number().optional().describe("The start date of the test run (UNIX timestamp)"),
				due_on: z.number().optional().describe("The end date of the test run (UNIX timestamp)")
			},
		},
		async ({ project_id, ...data }) => {
			try {
				const run = await clients.runs.addRun(project_id, data);

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(run, null, 2)
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
								project_id,
								details: "Failed to create test run"
							}, null, 2)
						}
					]
				};
			}
		}
	);

	/**
	 * Update an existing test run
	 */
	server.registerTool(
		"testrail_update_run",
		{
			description: "Update an existing test run - supports partial updates, only submit fields you want to change",
			inputSchema: {
				run_id: z.number().positive().describe("The ID of the test run to update"),
				name: z.string().min(1).optional().describe("The new name of the test run"),
				description: z.string().optional().describe("The new description of the test run"),
				milestone_id: z.number().positive().optional().describe("The new milestone ID to link to the test run"),
				include_all: z.boolean().optional().describe("True to include all test cases, false for custom selection"),
				case_ids: z.array(z.number().positive()).optional().describe("Array of case IDs for custom case selection (when include_all is false)"),
				refs: z.string().optional().describe("Comma-separated list of references/requirements"),
				start_on: z.number().optional().describe("The new start date of the test run (UNIX timestamp)"),
				due_on: z.number().optional().describe("The new end date of the test run (UNIX timestamp)")
			},
		},
		async ({ run_id, ...data }) => {
			try {
				const run = await clients.runs.updateRun(run_id, data);

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(run, null, 2)
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
								run_id,
								details: "Failed to update test run"
							}, null, 2)
						}
					]
				};
			}
		}
	);

	/**
	 * Close an existing test run
	 */
	server.registerTool(
		"testrail_close_run",
		{
			description: "Close an existing test run and archive its tests & results - WARNING: This action cannot be undone!",
			inputSchema: {
				run_id: z.number().positive().describe("The ID of the test run to close"),
				confirmation: z.literal("I_UNDERSTAND_THIS_CANNOT_BE_UNDONE").describe("Confirmation that you understand this action is irreversible")
			},
		},
		async ({ run_id, confirmation }) => {
			try {
				if (confirmation !== "I_UNDERSTAND_THIS_CANNOT_BE_UNDONE") {
					throw new Error("Confirmation required: closing a test run cannot be undone");
				}

				const run = await clients.runs.closeRun(run_id);

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(run, null, 2)
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
								run_id,
								details: "Failed to close test run"
							}, null, 2)
						}
					]
				};
			}
		}
	);
}
