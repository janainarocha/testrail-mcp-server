import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailTestsAPI } from "../api/testrail-tests.js";
/**
 * Test Tools
 * Tools for managing individual test instances in TestRail.
 * Tests are instances of test cases added to specific test runs or plans.
 */
export declare function registerTestTools(server: McpServer, clients: {
    tests: TestRailTestsAPI;
}): void;
