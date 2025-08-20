import { TestRailBase } from "./testrail-base.js";
/**
 * TestRail Report interface
 */
export interface Report {
    id: number;
    name: string;
    description: string | null;
    notify_user: boolean;
    notify_link: boolean;
    notify_link_recipients: string | null;
    notify_attachment: boolean;
    notify_attachment_recipients: string | null;
    notify_attachment_html_format: boolean;
    notify_attachment_pdf_format: boolean;
    cases_groupby?: string;
    changes_daterange?: string;
    changes_daterange_from?: string | null;
    changes_daterange_to?: string | null;
    suites_include?: string;
    suites_ids?: string | null;
    sections_include?: string;
    sections_ids?: string | null;
    cases_columns?: Record<string, number>;
    cases_filters?: string | null;
    cases_limit?: number;
    content_hide_links?: boolean;
    cases_include_new?: boolean;
    cases_include_updated?: boolean;
}
/**
 * TestRail Run Report Response interface
 */
export interface RunReportResponse {
    report_url: string;
    report_html: string;
    report_pdf: string;
}
/**
 * TestRail Reports API client
 * Handles report-related operations in TestRail
 */
export declare class TestRailReportsAPI extends TestRailBase {
    /**
     * Get available reports for a project
     * @param projectId - The ID of the project
     * @returns Promise<Report[]> - Array of available reports
     */
    getReports(projectId: number): Promise<Report[]>;
    /**
     * Execute a report and get URLs for access
     * @param reportTemplateId - The ID of the report template to execute
     * @returns Promise<RunReportResponse> - URLs for accessing the report
     */
    runReport(reportTemplateId: number): Promise<RunReportResponse>;
}
