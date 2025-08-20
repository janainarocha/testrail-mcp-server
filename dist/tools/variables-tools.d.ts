import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailVariablesAPI } from "../api/testrail-variables.js";
/**
 * Variable Tools
 * Tools for managing variables in TestRail datasets.
 * Variables are used in data-driven testing and require TestRail Enterprise license.
 */
export declare function registerVariableTools(server: McpServer, clients: {
    variables: TestRailVariablesAPI;
}): void;
