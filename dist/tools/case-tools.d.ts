import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailCasesAPI, TestRailCaseFieldsAPI, TestRailPrioritiesAPI } from "../api/index.js";
export declare function registerCaseTools(server: McpServer, clients: {
    cases: TestRailCasesAPI;
    caseFields: TestRailCaseFieldsAPI;
    priorities?: TestRailPrioritiesAPI;
}): void;
