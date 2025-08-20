import { z } from "zod";
/**
 * Register project-related MCP tools
 */
export function registerProjectTools(server, clients) {
    /**
     * List all projects
     */
    server.registerTool("testrail_list_projects", {
        description: "Get a list of all TestRail projects accessible to the authenticated user",
        inputSchema: {}
    }, async () => {
        try {
            const projectsResponse = await clients.projects.getProjects();
            const projects = Array.isArray(projectsResponse) ? projectsResponse : [];
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(projects, null, 2)
                    }
                ]
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: error instanceof Error ? error.message : String(error),
                            details: "Failed to fetch projects"
                        }, null, 2)
                    }
                ]
            };
        }
    });
    /**
     * Get project details
     */
    server.registerTool("testrail_get_project", {
        description: "Get detailed information about a specific TestRail project including its test suites",
        inputSchema: {
            project_id: z.number().describe("The ID of the project to retrieve")
        }
    }, async ({ project_id }) => {
        try {
            const project = await clients.projects.getProject(project_id);
            const suitesResponse = await clients.suites.getSuites(project_id);
            const suitesArray = Array.isArray(suitesResponse) ? suitesResponse : [];
            const result = {
                project: project,
                suites: suitesArray
            };
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(result, null, 2)
                    }
                ]
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: error instanceof Error ? error.message : String(error),
                            details: "Failed to get project"
                        }, null, 2)
                    }
                ]
            };
        }
    });
    /**
     * List sections in a suite
     */
    server.registerTool("testrail_list_sections", {
        description: "Get all sections in a TestRail test suite",
        inputSchema: {
            project_id: z.number().describe("The ID of the project"),
            suite_id: z.number().describe("The ID of the suite to get sections from")
        }
    }, async ({ project_id, suite_id }) => {
        try {
            const sections = await clients.sections.getSections(project_id, suite_id);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(sections, null, 2)
                    }
                ]
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: error instanceof Error ? error.message : String(error),
                            details: "Failed to get sections"
                        }, null, 2)
                    }
                ]
            };
        }
    });
    /**
     * Get priorities
     */
    server.registerTool("testrail_get_priorities", {
        description: "📊 Get all available test case priorities from TestRail with their IDs and names",
        inputSchema: {}
    }, async () => {
        try {
            const priorities = await clients.priorities.getPriorities();
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(priorities, null, 2)
                    }
                ]
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: error instanceof Error ? error.message : String(error),
                            details: "Failed to get priorities"
                        }, null, 2)
                    }
                ]
            };
        }
    });
    /**
     * Get templates
     */
    server.registerTool("testrail_get_templates", {
        description: "📋 Get available templates for a project - understand template options for better test case creation",
        inputSchema: {
            project_id: z.number().describe("Project ID to get templates for")
        }
    }, async ({ project_id }) => {
        try {
            const templates = await clients.projects.getTemplates(project_id);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(templates, null, 2)
                    }
                ]
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: error instanceof Error ? error.message : String(error),
                            details: "Failed to get templates"
                        }, null, 2)
                    }
                ]
            };
        }
    });
}
//# sourceMappingURL=project-tools.js.map