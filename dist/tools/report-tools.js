import { TestRailReportsAPI } from "../api/testrail-reports.js";
import { z } from "zod";
/**
 * Register report-related MCP tools
 */
export function registerReportTools(server, clients) {
    /**
     * Get available reports for a project
     */
    server.registerTool("testrail_get_reports", {
        description: "📊 Get a list of available reports for a TestRail project",
        inputSchema: {
            project_id: z.number().min(1).describe("The ID of the project for which you want a list of API accessible reports")
        }
    }, async ({ project_id }) => {
        try {
            if (!clients.reports || !(clients.reports instanceof TestRailReportsAPI)) {
                throw new Error("TestRailReportsAPI client not found in clients.reports");
            }
            const reports = await clients.reports.getReports(project_id);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(reports, null, 2)
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
                            error: error?.message || 'Unknown error',
                            details: "Failed to get reports"
                        }, null, 2)
                    }
                ]
            };
        }
    });
    /**
     * Execute a report and get access URLs
     */
    server.registerTool("testrail_run_report", {
        description: "🚀 Execute a TestRail report and get URLs for accessing it in HTML and PDF format",
        inputSchema: {
            report_template_id: z.number().min(1).describe("The ID of the report template to execute")
        }
    }, async ({ report_template_id }) => {
        try {
            if (!clients.reports || !(clients.reports instanceof TestRailReportsAPI)) {
                throw new Error("TestRailReportsAPI client not found in clients.reports");
            }
            const reportResult = await clients.reports.runReport(report_template_id);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(reportResult, null, 2)
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
                            error: error?.message || 'Unknown error',
                            details: "Failed to execute report"
                        }, null, 2)
                    }
                ]
            };
        }
    });
}
//# sourceMappingURL=report-tools.js.map