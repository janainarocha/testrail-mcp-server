import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailRunsAPI } from "../api/testrail-runs.js";
/**
 * Run Tools
 * Tools for managing test runs in TestRail.
 */
export declare function registerRunTools(server: McpServer, clients: {
    runs: TestRailRunsAPI;
}): void;
