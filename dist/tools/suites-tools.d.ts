import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailSuitesAPI } from "../api/testrail-suites.js";
/**
 * Suite Tools
 * Tools for managing test suites in TestRail - create, read, update, delete operations.
 */
export declare function registerSuiteTools(server: McpServer, clients: {
    suites: TestRailSuitesAPI;
}): void;
