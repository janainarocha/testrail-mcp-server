import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailResultsAPI } from "../api/testrail-results.js";
/**
 * Result Tools
 * Tools for retrieving test results from TestRail.
 */
export declare function registerResultTools(server: McpServer, clients: {
    results: TestRailResultsAPI;
}): void;
