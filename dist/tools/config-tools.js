import { z } from "zod";
import { TestRailConfigAPI } from "../api/testrail-config.js";
/**
 * Registers the get_configs tool for listing available configuration groups and configs for a project.
 * @param server MCP server instance
 * @param clients API clients
 */
export function registerConfigTools(server, clients) {
    /**
     * List available configuration groups and configs for a project
     * @mcp.tool
     * @mcp.name get_configs
     * @mcp.description Returns a list of available configurations, grouped by configuration groups, for a given project.
     * @mcp.param {number} project_id - The ID of the project
     * @mcp.returns {Array} Array of configuration groups, each with a list of configs
     */
    server.registerTool("testrail_get_configs", {
        description: "Returns a list of available configurations, grouped by configuration groups, for a given project.",
        inputSchema: {
            project_id: z.number().positive().describe("The ID of the project."),
        },
    }, async ({ project_id }) => {
        try {
            if (!clients.configs || !(clients.configs instanceof TestRailConfigAPI)) {
                throw new Error("TestRailConfigAPI client not found in clients.configs");
            }
            const configs = await clients.configs.getConfigs(project_id);
            return {
                content: [{ type: "text", text: JSON.stringify(configs, null, 2) }],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({ error: error.message || "Unknown error", details: "Failed to get configs" }, null, 2),
                    },
                ],
            };
        }
    });
}
//# sourceMappingURL=config-tools.js.map