import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailSharedStepsAPI } from "../api/testrail-sharedSteps.js";
/**
 * Shared Step Tools
 * Tools for managing shared steps in TestRail (requires TestRail 7.0+).
 */
export declare function registerSharedStepTools(server: McpServer, clients: {
    sharedSteps: TestRailSharedStepsAPI;
}): void;
