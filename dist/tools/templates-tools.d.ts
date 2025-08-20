import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailTemplatesAPI } from "../api/testrail-templates.js";
/**
 * Template Tools
 * Tools for retrieving template information (field layouts) in TestRail.
 * Templates define the field layouts for test cases and results.
 */
export declare function registerTemplateTools(server: McpServer, clients: {
    templates: TestRailTemplatesAPI;
}): void;
