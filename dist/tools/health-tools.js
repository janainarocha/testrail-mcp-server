/**
 * Capabilities Tool
 * This tool provides information about available TestRail MCP Server capabilities.
 */
export function registerHealthTools(server, clients) {
    /**
     * Get server capabilities and features
     */
    server.registerTool("testrail_get_capabilities", {
        description: "🎯 Get comprehensive overview of TestRail MCP Server capabilities and TestRail platform context",
        inputSchema: {}
    }, async () => {
        const capabilities = {
            platform_context: {
                name: "TestRail",
                description: "Comprehensive test case management platform for QA teams",
                key_concepts: {
                    projects: "Top-level containers for organizing test management",
                    suites: "Collections of test cases within projects",
                    test_cases: "Individual test scenarios with steps and expected results",
                    test_runs: "Execution instances of test cases with results",
                    test_plans: "Collections of test runs for comprehensive testing",
                    sections: "Hierarchical organization within suites",
                    milestones: "Project deadlines and release targets"
                },
                test_case_structure: {
                    title: "Brief description of what's being tested",
                    custom_steps: "Detailed actions to perform",
                    custom_expected: "What should happen (expected results)",
                    custom_preconds: "Setup requirements (preconditions)",
                    priority_levels: "1=Low, 2=Medium, 3=High, 4=Critical",
                    types: "Functional, Acceptance, Accessibility, etc."
                },
                common_workflows: [
                    "1. Test Case Creation: Create in sections within suites",
                    "2. Test Execution: Add cases to runs, record results",
                    "3. Test Planning: Group runs into plans for releases",
                    "4. Reporting: Track progress and quality metrics"
                ]
            },
            server_info: {
                name: "TestRail MCP Server",
                version: "1.0.0",
                mcp_tools_count: 80,
                api_coverage: "Complete TestRail REST API v2"
            },
            api_modules: {
                projects: "✅ Project management",
                cases: "✅ Test case operations",
                results: "✅ Test execution results",
                runs: "✅ Test run management",
                plans: "✅ Test plan orchestration",
                sections: "✅ Test organization",
                suites: "✅ Test suite management",
                milestones: "✅ Project milestones",
                labels: "✅ Test categorization",
                reports: "✅ Analytics and reporting",
                shared_steps: "✅ Reusable test steps",
                templates: "✅ Field layouts",
                tests: "✅ Individual test instances",
                variables: "✅ Data-driven testing",
                statuses: "✅ Test statuses",
                configs: "✅ Configuration management"
            },
            features: {
                comprehensive_api: "✅ Complete TestRail API coverage",
                json_output: "✅ AI-optimized responses",
                batch_operations: "✅ Bulk operations support",
                safety_confirmations: "✅ Destructive action protection",
                enterprise_support: "✅ Advanced TestRail features"
            },
            compatibility: {
                testrail_versions: "TestRail Cloud & Server",
                minimum_permissions: "Standard user with API access",
                enterprise_features: "Variables, SharedSteps, Advanced Templates"
            }
        };
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(capabilities, null, 2)
                }
            ]
        };
    });
}
//# sourceMappingURL=health-tools.js.map