#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { registerTools } from "./tools/index.js";
import { 
	TestRailCasesAPI, 
	TestRailPlansAPI, 
	TestRailLabelsAPI, 
	TestRailProjectsAPI, 
	TestRailMilestonesAPI, 
	TestRailSectionsAPI, 
	TestRailSuitesAPI, 
	TestRailPrioritiesAPI, 
	TestRailCaseFieldsAPI, 
	TestRailCaseTypesAPI, 
	TestRailStatusesAPI,
	TestRailConfigAPI,
	TestRailReportsAPI,
	TestRailResultsAPI,
	TestRailRunsAPI,
	TestRailSharedStepsAPI,
	TestRailTemplatesAPI,
	TestRailTestsAPI,
	TestRailVariablesAPI
} from "./api/index.js";

/**
 * TestRail MCP Server
 *
 * This MCP server provides AI assistants with the ability to create and manage
 * test cases in TestRail through the TestRail REST API.
 *
 * Required environment variables:
 * - TESTRAIL_URL: TestRail instance URL (e.g., https://yourcompany.testrail.io)
 * - TESTRAIL_USER: TestRail username/email
 * - TESTRAIL_API_KEY: TestRail API key (recommended) or password
 */

/**
 * Configuration schema for environment validation
 */
const ConfigSchema = z.object({
	TESTRAIL_URL: z.string().url("TestRail URL must be a valid URL"),
	TESTRAIL_USER: z.string().min(1, "TestRail user is required"),
	TESTRAIL_API_KEY: z.string().min(1, "TestRail API key is required"),
});

/**
 * Validate environment configuration
 */
function validateConfig() {
	try {
		return ConfigSchema.parse({
			TESTRAIL_URL: process.env.TESTRAIL_URL,
			TESTRAIL_USER: process.env.TESTRAIL_USER,
			TESTRAIL_API_KEY: process.env.TESTRAIL_API_KEY,
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			console.error("❌ Configuration validation failed:");
			error.errors.forEach((err) => {
				console.error(`  - ${err.path.join(".")}: ${err.message}`);
			});
			console.error("\n📋 Required environment variables:");
			console.error("  - TESTRAIL_URL: Your TestRail instance URL");
			console.error("  - TESTRAIL_USER: Your TestRail username/email");
			console.error("  - TESTRAIL_API_KEY: Your TestRail API key");
			console.error("\n Get your API key from TestRail: My Settings > API Keys");
		} else {
			console.error("❌ Configuration error:", error);
		}
		process.exit(1);
	}
}

/**
 * Main server function
 */
async function main() {
	// Validate configuration
	const config = validateConfig();

	// Map to the type expected by the clients
	const testRailConfig = {
		baseUrl: config.TESTRAIL_URL,
		username: config.TESTRAIL_USER,
		apiKey: config.TESTRAIL_API_KEY,
	};

	// Initialize the split clients
	 const testRailClients = {
		 cases: new TestRailCasesAPI(testRailConfig),
		 labels: new TestRailLabelsAPI(testRailConfig),
		 projects: new TestRailProjectsAPI(testRailConfig),
		 milestones: new TestRailMilestonesAPI(testRailConfig),
		 plans: new TestRailPlansAPI(testRailConfig),
		 sections: new TestRailSectionsAPI(testRailConfig),
		 suites: new TestRailSuitesAPI(testRailConfig),
		 priorities: new TestRailPrioritiesAPI(testRailConfig),
		 caseFields: new TestRailCaseFieldsAPI(testRailConfig),
		 caseTypes: new TestRailCaseTypesAPI(testRailConfig),
		 statuses: new TestRailStatusesAPI(testRailConfig),
		 configs: new TestRailConfigAPI(testRailConfig),
		 reports: new TestRailReportsAPI(testRailConfig),
		 results: new TestRailResultsAPI(testRailConfig),
		 runs: new TestRailRunsAPI(testRailConfig),
		 sharedSteps: new TestRailSharedStepsAPI(testRailConfig),
		 templates: new TestRailTemplatesAPI(testRailConfig),
		 tests: new TestRailTestsAPI(testRailConfig),
		 variables: new TestRailVariablesAPI(testRailConfig),
	 };

	// Create MCP server instance
	const server = new McpServer({
		name: "testrail-mcp-server",
		version: "1.0.0",
		capabilities: {
			tools: {},
		},
	});

	// Register all tools (now receives all clients)
	registerTools(server, testRailClients);

	// Setup transport and start server
	const transport = new StdioServerTransport();
	await server.connect(transport);

	console.error("🚀 TestRail MCP Server started successfully");
	console.error("🔗 Connected to:", config.TESTRAIL_URL);
	console.error("👤 User:", config.TESTRAIL_USER);
	console.error("✅ Ready to handle AI requests for TestRail operations");
}

// Handle graceful shutdown
process.on("SIGINT", () => {
	console.error("\n⏹️  TestRail MCP Server shutting down...");
	process.exit(0);
});

process.on("SIGTERM", () => {
	console.error("\n⏹️  TestRail MCP Server shutting down...");
	process.exit(0);
});

// Start the server
main().catch((error) => {
	console.error("💥 Fatal error starting TestRail MCP Server:", error);
	process.exit(1);
});
