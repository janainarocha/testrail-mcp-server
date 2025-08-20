import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailSectionsAPI } from "../api/testrail-sections.js";
/**
 * Section Tools
 * Tools for managing test sections in TestRail.
 */
export declare function registerSectionTools(server: McpServer, clients: {
    sections: TestRailSectionsAPI;
}): void;
