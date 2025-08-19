import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailResultsAPI } from "../api/testrail-results.js";
import { z } from "zod";

/**
 * Result Tools
 * Tools for retrieving test results from TestRail.
 */

export function registerResultTools(server: McpServer, clients: { results: TestRailResultsAPI }) {
	/**
	 * Get test results for a specific test
	 */
	server.registerTool(
		"testrail_get_results",
		{
			description: "Get test results for a specific test with optional filtering and pagination",
			inputSchema: {
				test_id: z.number().positive().describe("The ID of the test"),
				limit: z.number().positive().max(250).optional().describe("The number of test results to return (max 250)"),
				offset: z.number().min(0).optional().describe("The number of records to skip"),
				status_id: z.array(z.number()).optional().describe("Array of status IDs to filter by"),
				defects_filter: z.string().optional().describe("A single Defect ID (e.g. TR-1, 4291, etc.)")
			},
		},
		async ({ test_id, limit, offset, status_id, defects_filter }) => {
			try {
				const options = {
					limit,
					offset,
					status_id,
					defects_filter
				};

				const results = await clients.results.getResults(test_id, options);

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(results, null, 2)
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
								test_id,
								details: "Failed to get test results"
							}, null, 2)
						}
					]
				};
			}
		}
	);

	/**
	 * Get test results for a test run and case combination
	 */
	server.registerTool(
		"testrail_get_results_for_case",
		{
			description: "Get test results for a test run and case combination with optional filtering and pagination",
			inputSchema: {
				run_id: z.number().positive().describe("The ID of the test run"),
				case_id: z.number().positive().describe("The ID of the test case"),
				limit: z.number().positive().max(250).optional().describe("The number of test results to return (max 250)"),
				offset: z.number().min(0).optional().describe("The number of records to skip"),
				status_id: z.array(z.number()).optional().describe("Array of status IDs to filter by"),
				defects_filter: z.string().optional().describe("A single Defect ID (e.g. TR-1, 4291, etc.)")
			},
		},
		async ({ run_id, case_id, limit, offset, status_id, defects_filter }) => {
			try {
				const options = {
					limit,
					offset,
					status_id,
					defects_filter
				};

				const results = await clients.results.getResultsForCase(run_id, case_id, options);

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(results, null, 2)
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
								case_id,
								details: "Failed to get test results for case"
							}, null, 2)
						}
					]
				};
			}
		}
	);

	/**
	 * Get test results for a test run
	 */
	server.registerTool(
		"testrail_get_results_for_run",
		{
			description: "Get test results for a test run with optional filtering and pagination",
			inputSchema: {
				run_id: z.number().positive().describe("The ID of the test run"),
				limit: z.number().positive().max(250).optional().describe("The number of test results to return (max 250)"),
				offset: z.number().min(0).optional().describe("The number of records to skip"),
				status_id: z.array(z.number()).optional().describe("Array of status IDs to filter by"),
				defects_filter: z.string().optional().describe("A single Defect ID (e.g. TR-1, 4291, etc.)"),
				created_after: z.number().optional().describe("Only return results created after this date (UNIX timestamp)"),
				created_before: z.number().optional().describe("Only return results created before this date (UNIX timestamp)"),
				created_by: z.array(z.number()).optional().describe("Array of creator user IDs to filter by")
			},
		},
		async ({ run_id, limit, offset, status_id, defects_filter, created_after, created_before, created_by }) => {
			try {
				const options = {
					limit,
					offset,
					status_id,
					defects_filter,
					created_after,
					created_before,
					created_by
				};

				const results = await clients.results.getResultsForRun(run_id, options);

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(results, null, 2)
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
								details: "Failed to get test results for run"
							}, null, 2)
						}
					]
				};
			}
		}
	);

	/**
	 * Add a new test result for a specific test
	 */
	server.registerTool(
		"testrail_add_result",
		{
			description: "Add a new test result, comment or assign a test for a specific test ID",
			inputSchema: {
				test_id: z.number().positive().describe("The ID of the test the result should be added to"),
				status_id: z.number().positive().optional().describe("The ID of the test status (1=Passed, 2=Blocked, 4=Retest, 5=Failed)"),
				comment: z.string().optional().describe("The comment/description for the test result"),
				version: z.string().optional().describe("The version or build you tested against"),
				elapsed: z.string().optional().describe("The time it took to execute the test, e.g. '30s' or '1m 45s'"),
				defects: z.string().optional().describe("A comma-separated list of defects to link to the test result"),
				assignedto_id: z.number().optional().describe("The ID of a user the test should be assigned to"),
				custom_step_results: z.array(z.object({
					content: z.string().describe("Step content"),
					expected: z.string().describe("Expected result"),
					actual: z.string().describe("Actual result"),
					status_id: z.number().describe("Status ID for this step")
				})).optional().describe("Array of step results for structured tests")
			},
		},
		async ({ test_id, ...data }) => {
			try {
				const result = await clients.results.addResult(test_id, data);

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(result, null, 2)
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
								test_id,
								details: "Failed to add test result"
							}, null, 2)
						}
					]
				};
			}
		}
	);

	/**
	 * Add a new test result for a test run and case combination
	 */
	server.registerTool(
		"testrail_add_result_for_case",
		{
			description: "Add a new test result, comment or assign a test for a test run and case combination",
			inputSchema: {
				run_id: z.number().positive().describe("The ID of the test run"),
				case_id: z.number().positive().describe("The ID of the test case"),
				status_id: z.number().positive().optional().describe("The ID of the test status (1=Passed, 2=Blocked, 4=Retest, 5=Failed)"),
				comment: z.string().optional().describe("The comment/description for the test result"),
				version: z.string().optional().describe("The version or build you tested against"),
				elapsed: z.string().optional().describe("The time it took to execute the test, e.g. '30s' or '1m 45s'"),
				defects: z.string().optional().describe("A comma-separated list of defects to link to the test result"),
				assignedto_id: z.number().optional().describe("The ID of a user the test should be assigned to"),
				custom_step_results: z.array(z.object({
					content: z.string().describe("Step content"),
					expected: z.string().describe("Expected result"),
					actual: z.string().describe("Actual result"),
					status_id: z.number().describe("Status ID for this step")
				})).optional().describe("Array of step results for structured tests")
			},
		},
		async ({ run_id, case_id, ...data }) => {
			try {
				const result = await clients.results.addResultForCase(run_id, case_id, data);

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(result, null, 2)
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
								case_id,
								details: "Failed to add test result for case"
							}, null, 2)
						}
					]
				};
			}
		}
	);

	/**
	 * Add multiple test results for a test run using test IDs
	 */
	server.registerTool(
		"testrail_add_results",
		{
			description: "Add multiple test results, comments or assignments for a test run using test IDs - ideal for bulk operations",
			inputSchema: {
				run_id: z.number().positive().describe("The ID of the test run the results should be added to"),
				results: z.array(z.object({
					test_id: z.number().positive().describe("The ID of the test"),
					status_id: z.number().positive().optional().describe("The ID of the test status (1=Passed, 2=Blocked, 4=Retest, 5=Failed)"),
					comment: z.string().optional().describe("The comment/description for the test result"),
					version: z.string().optional().describe("The version or build you tested against"),
					elapsed: z.string().optional().describe("The time it took to execute the test, e.g. '30s' or '1m 45s'"),
					defects: z.string().optional().describe("A comma-separated list of defects to link to the test result"),
					assignedto_id: z.number().optional().describe("The ID of a user the test should be assigned to"),
					custom_step_results: z.array(z.object({
						content: z.string().describe("Step content"),
						expected: z.string().describe("Expected result"),
						actual: z.string().describe("Actual result"),
						status_id: z.number().describe("Status ID for this step")
					})).optional().describe("Array of step results for structured tests")
				})).describe("Array of test results to add")
			},
		},
		async ({ run_id, results }) => {
			try {
				const addedResults = await clients.results.addResults(run_id, results);

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(addedResults, null, 2)
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
								results_count: results.length,
								details: "Failed to add bulk test results"
							}, null, 2)
						}
					]
				};
			}
		}
	);

	/**
	 * Add multiple test results for a test run using case IDs
	 */
	server.registerTool(
		"testrail_add_results_for_cases",
		{
			description: "Add multiple test results, comments or assignments for a test run using case IDs - ideal for bulk operations",
			inputSchema: {
				run_id: z.number().positive().describe("The ID of the test run the results should be added to"),
				results: z.array(z.object({
					case_id: z.number().positive().describe("The ID of the test case"),
					status_id: z.number().positive().optional().describe("The ID of the test status (1=Passed, 2=Blocked, 4=Retest, 5=Failed)"),
					comment: z.string().optional().describe("The comment/description for the test result"),
					version: z.string().optional().describe("The version or build you tested against"),
					elapsed: z.string().optional().describe("The time it took to execute the test, e.g. '30s' or '1m 45s'"),
					defects: z.string().optional().describe("A comma-separated list of defects to link to the test result"),
					assignedto_id: z.number().optional().describe("The ID of a user the test should be assigned to"),
					custom_step_results: z.array(z.object({
						content: z.string().describe("Step content"),
						expected: z.string().describe("Expected result"),
						actual: z.string().describe("Actual result"),
						status_id: z.number().describe("Status ID for this step")
					})).optional().describe("Array of step results for structured tests")
				})).describe("Array of test results to add using case IDs")
			},
		},
		async ({ run_id, results }) => {
			try {
				const addedResults = await clients.results.addResultsForCases(run_id, results);

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(addedResults, null, 2)
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
								results_count: results.length,
								details: "Failed to add bulk test results for cases"
							}, null, 2)
						}
					]
				};
			}
		}
	);

	/**
	 * Get available test result custom fields
	 */
	server.registerTool(
		"testrail_get_result_fields",
		{
			description: "Get available test result custom fields - useful for understanding custom field options and configurations",
			inputSchema: {
				// No input parameters required
			},
		},
		async () => {
			try {
				const fields = await clients.results.getResultFields();

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(fields, null, 2)
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
								details: "Failed to get result fields"
							}, null, 2)
						}
					]
				};
			}
		}
	);
}
