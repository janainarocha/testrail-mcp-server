import { TestRailBase } from "./testrail-base.js";
/**
 * TestRail Reports API client
 * Handles report-related operations in TestRail
 */
export class TestRailReportsAPI extends TestRailBase {
    /**
     * Get available reports for a project
     * @param projectId - The ID of the project
     * @returns Promise<Report[]> - Array of available reports
     */
    async getReports(projectId) {
        return this.makeRequest(`get_reports/${projectId}`);
    }
    /**
     * Execute a report and get URLs for access
     * @param reportTemplateId - The ID of the report template to execute
     * @returns Promise<RunReportResponse> - URLs for accessing the report
     */
    async runReport(reportTemplateId) {
        return this.makeRequest(`run_report/${reportTemplateId}`);
    }
}
//# sourceMappingURL=testrail-reports.js.map