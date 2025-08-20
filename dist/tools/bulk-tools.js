import { z } from "zod";
/**
 * Bulk Operations Tool
 * This tool handles bulk export of test cases for backup or migration.
 */
export function registerBulkTools(server, clients) {
    /**
     * Bulk export test cases to structured format
     */
    server.registerTool("testrail_bulk_export_cases", {
        description: "📤 Export test cases in bulk with comprehensive data for backup or migration",
        inputSchema: {
            project_id: z.number().describe("Project ID to export from"),
            suite_id: z.number().optional().describe("Suite ID to export (all suites if not specified)"),
            section_id: z.number().optional().describe("Section ID to export (all sections if not specified)"),
            include_steps: z.boolean().optional().describe("Include detailed test steps (default: true)"),
            include_history: z.boolean().optional().describe("Include change history (default: false)"),
            format: z.enum(["json", "csv_summary"]).optional().describe("Export format (default: json)")
        }
    }, async ({ project_id, suite_id, section_id, include_steps = true, include_history = false, format = "json" }) => {
        try {
            // Get basic case data
            const cases = await clients.cases.getCases(project_id, suite_id, {
                sectionId: section_id
            });
            if (!Array.isArray(cases) || cases.length === 0) {
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                message: "No test cases found for the specified criteria",
                                export_summary: {
                                    project_id,
                                    suite_id,
                                    section_id,
                                    cases_found: 0
                                }
                            }, null, 2)
                        }]
                };
            }
            // Enrich with additional data if requested
            const enrichedCases = [];
            for (const testCase of cases) {
                let enrichedCase = { ...testCase };
                // Add detailed steps if requested
                if (include_steps && testCase.id) {
                    try {
                        const fullCase = await clients.cases.getCase(testCase.id);
                        enrichedCase = { ...enrichedCase, ...fullCase };
                    }
                    catch (error) {
                        console.warn(`Could not fetch details for case ${testCase.id}`);
                    }
                }
                // Add history if requested
                if (include_history && testCase.id) {
                    try {
                        const history = await clients.cases.getCaseHistory(testCase.id, { limit: 10 });
                        enrichedCase.change_history = history;
                    }
                    catch (error) {
                        console.warn(`Could not fetch history for case ${testCase.id}`);
                    }
                }
                enrichedCases.push(enrichedCase);
            }
            const exportData = {
                export_metadata: {
                    timestamp: new Date().toISOString(),
                    project_id,
                    suite_id,
                    section_id,
                    total_cases: enrichedCases.length,
                    include_steps,
                    include_history,
                    format
                },
                test_cases: enrichedCases
            };
            if (format === "csv_summary") {
                // Convert to CSV-like summary
                const csvData = enrichedCases.map(tc => ({
                    id: tc.id,
                    title: tc.title,
                    section_id: tc.section_id,
                    priority: tc.priority_id,
                    type: tc.type_id,
                    created_on: new Date(tc.created_on * 1000).toISOString(),
                    updated_on: new Date(tc.updated_on * 1000).toISOString()
                }));
                return {
                    content: [{
                            type: "text",
                            text: JSON.stringify({
                                ...exportData,
                                csv_summary: csvData
                            }, null, 2)
                        }]
                };
            }
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(exportData, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({
                            error: error instanceof Error ? error.message : String(error),
                            details: "Failed to export test cases"
                        }, null, 2)
                    }]
            };
        }
    });
}
//# sourceMappingURL=bulk-tools.js.map