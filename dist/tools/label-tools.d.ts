import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailLabelsAPI } from "../api/testrail-labels.js";
/**
 * Label Tools
 * Tools for retrieving and managing labels in TestRail.
 */
export declare function registerLabelTools(server: McpServer, clients: {
    labels: TestRailLabelsAPI;
}): void;
