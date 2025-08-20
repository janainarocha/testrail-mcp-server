import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailCasesAPI, TestRailPrioritiesAPI, TestRailCaseFieldsAPI, TestRailCaseTypesAPI, TestRailStatusesAPI } from "../api/index.js";
/**
 * Search and Metadata Tools
 * These tools handle searching, filtering, and retrieving metadata about TestRail entities.
 */
export declare function registerSearchTools(server: McpServer, clients: {
    cases: TestRailCasesAPI;
    priorities: TestRailPrioritiesAPI;
    caseFields: TestRailCaseFieldsAPI;
    caseTypes: TestRailCaseTypesAPI;
    statuses: TestRailStatusesAPI;
}): void;
