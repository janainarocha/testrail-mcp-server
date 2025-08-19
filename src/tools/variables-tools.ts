import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailVariablesAPI } from "../api/testrail-variables.js";
import { z } from "zod";

/**
 * Variable Tools
 * Tools for managing variables in TestRail datasets.
 * Variables are used in data-driven testing and require TestRail Enterprise license.
 */

export function registerVariableTools(server: McpServer, clients: { variables: TestRailVariablesAPI }) {
	/**
	 * Get all variables for a project
	 */
	server.registerTool(
		"testrail_get_variables",
		{
			description: "📊 Get all variables for a project - used in data-driven testing (TestRail Enterprise required)",
			inputSchema: {
				project_id: z.number().describe("The ID of the project to get variables from")
			},
		},
		async ({ project_id }) => {
			try {
				const variablesResponse = await clients.variables.getVariables(project_id);

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(variablesResponse, null, 2)
						}
					]
				};
			} catch (error: any) {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({
								error: "Failed to get variables",
								details: error.message,
								project_id,
								note: "Variables require TestRail Enterprise license and appropriate permissions"
							}, null, 2)
						}
					],
					isError: true
				};
			}
		}
	);

	/**
	 * Create a new variable
	 */
	server.registerTool(
		"testrail_add_variable",
		{
			description: "➕ Create a new variable in a project for data-driven testing (TestRail Enterprise required)",
			inputSchema: {
				project_id: z.number().describe("The ID of the project to add the variable to"),
				name: z.string().describe("The name of the variable")
			},
		},
		async ({ project_id, name }) => {
			try {
				const variable = await clients.variables.addVariable(project_id, { name });

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({
								success: true,
								message: "Variable created successfully",
								variable
							}, null, 2)
						}
					]
				};
			} catch (error: any) {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({
								error: "Failed to create variable",
								details: error.message,
								project_id,
								name,
								note: "Variables require TestRail Enterprise license and add/edit permissions for Test Data"
							}, null, 2)
						}
					],
					isError: true
				};
			}
		}
	);

	/**
	 * Update an existing variable
	 */
	server.registerTool(
		"testrail_update_variable",
		{
			description: "✏️ Update an existing variable name (TestRail Enterprise required)",
			inputSchema: {
				variable_id: z.number().describe("The ID of the variable to update"),
				name: z.string().describe("The new name for the variable")
			},
		},
		async ({ variable_id, name }) => {
			try {
				const updatedVariable = await clients.variables.updateVariable(variable_id, { name });

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({
								success: true,
								message: "Variable updated successfully",
								variable: updatedVariable
							}, null, 2)
						}
					]
				};
			} catch (error: any) {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({
								error: "Failed to update variable",
								details: error.message,
								variable_id,
								name
							}, null, 2)
						}
					],
					isError: true
				};
			}
		}
	);

	/**
	 * Delete a variable
	 */
	server.registerTool(
		"testrail_delete_variable",
		{
			description: "🗑️ Delete a variable (WARNING: Also deletes corresponding dataset values - TestRail Enterprise required)",
			inputSchema: {
				variable_id: z.number().describe("The ID of the variable to delete"),
				confirmation: z.literal("DELETE_VARIABLE").describe("Must be 'DELETE_VARIABLE' to confirm deletion (required for safety)")
			},
		},
		async ({ variable_id, confirmation }) => {
			if (confirmation !== "DELETE_VARIABLE") {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({
								error: "Invalid confirmation",
								message: "Must provide confirmation='DELETE_VARIABLE' to delete a variable",
								variable_id
							}, null, 2)
						}
					],
					isError: true
				};
			}

			try {
				await clients.variables.deleteVariable(variable_id);

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({
								success: true,
								message: "Variable deleted successfully (including corresponding dataset values)",
								variable_id
							}, null, 2)
						}
					]
				};
			} catch (error: any) {
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify({
								error: "Failed to delete variable",
								details: error.message,
								variable_id
							}, null, 2)
						}
					],
					isError: true
				};
			}
		}
	);
}