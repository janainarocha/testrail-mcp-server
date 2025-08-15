import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailAPI } from "../testrail-api.js";

// Import modular tool registrations
import { registerProjectTools } from "./project-tools.js";
import { registerCaseTools } from "./case-tools.js";
import { registerBatchTools } from "./batch-tools.js";
import { registerSearchTools } from "./search-tools.js";
import { registerAdminTools } from "./admin-tools.js";

/**
 * Register all MCP tools for TestRail operations
 * This is the main entry point that coordinates all tool modules.
 */
export function registerTools(server: McpServer, api: TestRailAPI) {
	// Register all tool modules
	registerProjectTools(server, api);
	registerCaseTools(server, api);
	registerBatchTools(server, api);
	registerSearchTools(server, api);
	registerAdminTools(server, api);

	console.log("✅ All TestRail MCP tools registered successfully");
	console.log("📊 Modules loaded:");
	console.log("   - Project management tools");
	console.log("   - Individual test case creation tools");
	console.log("   - Batch operations and preview tools");
	console.log("   - Search and metadata tools");
	console.log("   - Administrative and dangerous operations");
}
