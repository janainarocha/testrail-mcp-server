import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Import modular tool registrations
import { registerProjectTools } from "./project-tools.js";
import { registerCaseTools } from "./case-tools.js";
import { registerSearchTools } from "./search-tools.js";
import { registerLabelTools } from "./label-tools.js";
import { registerMilestoneTools } from "./milestones-tools.js";
import { registerPlanTools } from "./plan-tools.js";
import { registerConfigTools } from "./config-tools.js";
import { registerReportTools } from "./report-tools.js";
import { registerResultTools } from "./results-tools.js";
import { registerRunTools } from "./runs-tools.js";
import { registerSectionTools } from "./sections-tools.js";
import { registerSharedStepTools } from "./sharedSteps-tools.js";
import { registerStatusTools } from "./statuses-tools.js";
import { registerSuiteTools } from "./suites-tools.js";
import { registerTemplateTools } from "./templates-tools.js";
import { registerTestTools } from "./tests-tools.js";
import { registerVariableTools } from "./variables-tools.js";
import { registerHealthTools } from "./health-tools.js";
import { registerBulkTools } from "./bulk-tools.js";

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
	registerConfigTools(server, clients);
	registerReportTools(server, clients);
	registerResultTools(server, clients);
	registerRunTools(server, clients);
	registerSectionTools(server, clients);
	registerSharedStepTools(server, clients);
	registerStatusTools(server, clients);
	registerSuiteTools(server, clients);
	registerTemplateTools(server, clients);
	registerTestTools(server, clients);
	registerVariableTools(server, clients);
	registerHealthTools(server, clients);
	registerBulkTools(server, clients);

	console.log("✅ All TestRail MCP tools registered successfully");
}
