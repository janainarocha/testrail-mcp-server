import { z } from "zod";
/**
 * Test Tools
 * Tools for managing individual test instances in TestRail.
 * Tests are instances of test cases added to specific test runs or plans.
 */
export function registerTestTools(server, clients) {
    /**
     * Get a specific test by ID
     */
    server.registerTool("testrail_get_test", {
        description: "🔍 Get detailed information about a specific test instance (test case within a run)",
        inputSchema: {
            test_id: z.number().describe("The ID of the test to retrieve"),
            with_data: z.string().optional().describe("Optional parameter to get additional data")
        },
    }, async ({ test_id, with_data }) => {
        try {
            const test = await clients.tests.getTest(test_id, with_data);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(test, null, 2)
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
                            error: "Failed to get test",
                            details: error.message,
                            test_id
                        }, null, 2)
                    }
                ],
                isError: true
            };
        }
    });
    /**
     * Get all tests for a test run
     */
    server.registerTool("testrail_get_tests", {
        description: "📝 Get all tests for a test run with optional filtering (status, labels, pagination)",
        inputSchema: {
            run_id: z.number().describe("The ID of the test run"),
            status_id: z.array(z.number()).optional().describe("Array of status IDs to filter by"),
            limit: z.number().max(250).optional().describe("Number of tests to return (max 250) - TestRail 6.7+"),
            offset: z.number().min(0).optional().describe("Position to start from for pagination - TestRail 6.7+"),
            label_id: z.array(z.number()).optional().describe("Array of label IDs to filter by")
        },
    }, async ({ run_id, status_id, limit, offset, label_id }) => {
        try {
            const options = {
                status_id,
                limit,
                offset,
                label_id
            };
            const testsResponse = await clients.tests.getTests(run_id, options);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(testsResponse, null, 2)
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
                            error: "Failed to get tests",
                            details: error.message,
                            run_id
                        }, null, 2)
                    }
                ],
                isError: true
            };
        }
    });
    /**
     * Update labels assigned to a test
     */
    server.registerTool("testrail_update_test", {
        description: "🏷️ Update labels assigned to a specific test",
        inputSchema: {
            test_id: z.number().describe("The ID of the test to update"),
            labels: z.array(z.union([z.number(), z.string()])).describe("Array of label IDs or titles to assign")
        },
    }, async ({ test_id, labels }) => {
        try {
            const updatedTest = await clients.tests.updateTest(test_id, labels);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            message: "Test labels updated successfully",
                            test: updatedTest
                        }, null, 2)
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
                            error: "Failed to update test labels",
                            details: error.message,
                            test_id
                        }, null, 2)
                    }
                ],
                isError: true
            };
        }
    });
    /**
     * Update labels for multiple tests with the same values
     */
    server.registerTool("testrail_update_tests_batch", {
        description: "🏷️ Update labels for multiple tests with the same values (batch operation)",
        inputSchema: {
            test_ids: z.array(z.number()).describe("Array of test IDs to update"),
            labels: z.array(z.union([z.number(), z.string()])).describe("Array of label IDs or titles to assign to all tests"),
            confirmation: z.literal("UPDATE_MULTIPLE_TESTS").describe("Must be 'UPDATE_MULTIPLE_TESTS' to confirm batch operation")
        },
    }, async ({ test_ids, labels, confirmation }) => {
        if (confirmation !== "UPDATE_MULTIPLE_TESTS") {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: "Invalid confirmation",
                            message: "Must provide confirmation='UPDATE_MULTIPLE_TESTS' for batch operations",
                            test_ids
                        }, null, 2)
                    }
                ],
                isError: true
            };
        }
        try {
            const result = await clients.tests.updateTests(test_ids, labels);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            message: `Successfully updated labels for ${test_ids.length} tests`,
                            result
                        }, null, 2)
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
                            error: "Failed to update tests in batch",
                            details: error.message,
                            test_ids
                        }, null, 2)
                    }
                ],
                isError: true
            };
        }
    });
}
//# sourceMappingURL=tests-tools.js.map