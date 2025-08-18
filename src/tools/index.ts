import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import modular tool registrations
import { registerProjectTools } from "./project-tools.js";
import { registerCaseTools } from "./case-tools.js";
import { registerSearchTools } from "./search-tools.js";
import { registerLabelTools } from "./label-tools.js";
import { registerMilestoneTools } from "./milestones-tools.js";
import { registerPlanTools } from "./plan-tools.js";

/**
 * Register all MCP tools for TestRail operations
 * This is the main entry point that coordinates all tool modules.
 */
export function registerTools(server: McpServer, clients: any) {
	// Register all tool modules
	registerProjectTools(server, clients);
	registerCaseTools(server, clients);
	registerSearchTools(server, clients);
	registerLabelTools(server, clients);
	registerMilestoneTools(server, clients);
	registerPlanTools(server, clients);

	console.log("✅ All TestRail MCP tools registered successfully");
	console.log("📊 Modules loaded:");
	console.log("   - Project management tools");
	console.log("   - Individual test case creation and management tools");
	console.log("   - Batch operations and preview tools");
	console.log("   - Search and metadata tools");
	console.log("   - Label management tools");
	console.log("   - Milestone management tools");
	console.log("   - Plan management tools");
}
