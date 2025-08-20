import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TestRailMilestonesAPI } from "../api/testrail-milestones.js";
/**
 * Milestone Tools
 * Tools for retrieving and managing milestones in TestRail.
 */
export declare function registerMilestoneTools(server: McpServer, clients: {
    milestones: TestRailMilestonesAPI;
}): void;
