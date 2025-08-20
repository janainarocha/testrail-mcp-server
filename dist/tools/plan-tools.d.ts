import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailPlansAPI } from "../api/testrail-plans.js";
/**
 * Plan Tools
 * Tools for retrieving and managing test plans in TestRail.
 */
export declare function registerPlanTools(server: McpServer, clients: {
    plans: TestRailPlansAPI;
}): void;
