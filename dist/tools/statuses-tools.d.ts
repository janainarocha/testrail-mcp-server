import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailStatusesAPI } from "../api/testrail-statuses.js";
/**
 * Status Tools
 * Tools for retrieving test statuses and case statuses in TestRail.
 */
export declare function registerStatusTools(server: McpServer, clients: {
    statuses: TestRailStatusesAPI;
}): void;
