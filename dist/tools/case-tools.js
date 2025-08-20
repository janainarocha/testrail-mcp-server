import { z } from "zod";
/**
 * Test Case Tools
 * Tools for retrieving and managing individual test cases in TestRail.
 */
// Shared schemas for reusability
const caseIdSchema = z.number().positive().describe("Test case ID");
const projectIdSchema = z.number().positive().describe("The ID of the project");
const timestampSchema = z.number().positive().describe("UNIX timestamp");
const idArraySchema = z.array(z.number().positive()).optional();
export function registerCaseTools(server, clients) {
    /**
     * Get complete test case data from TestRail API
     */
    server.registerTool("testrail_get_case", {
        description: "Get a test case by ID with complete API data including steps, custom fields, etc",
        inputSchema: {
            case_id: caseIdSchema,
        },
    }, async ({ case_id }) => {
        try {
            const testCase = await clients.cases.getCase(case_id);
            return {
                content: [{ type: "text", text: JSON.stringify(testCase, null, 2) }],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: "Failed to get test case",
                            case_id,
                            message: error.message || "Unknown error",
                            code: error.code || "UNKNOWN",
                        }, null, 2),
                    },
                ],
            };
        }
    });
    /**
     * Get list of test cases with comprehensive filtering options
     */
    server.registerTool("testrail_get_cases", {
        description: "Get test cases for a project or suite with all API filters (limit, offset, priority, type, dates, etc.)",
        inputSchema: {
            project_id: projectIdSchema,
            suite_id: z.number().positive().optional().describe("The ID of the test suite (optional if project is in single suite mode)"),
            section_id: z.number().positive().optional().describe("The ID of a test case section"),
            filter: z.string().optional().describe("Only return cases with matching filter string in the case title"),
            limit: z.number().positive().max(250).optional().describe("The number of test cases the response should return (max 250)"),
            offset: z.number().min(0).optional().describe("Where to start counting the test cases from (the offset)"),
            priority_id: idArraySchema.describe("A list of priority IDs to filter by"),
            type_id: idArraySchema.describe("A list of case type IDs to filter by"),
            template_id: idArraySchema.describe("A list of template IDs to filter by"),
            label_id: idArraySchema.describe("A list of label IDs to filter by"),
            created_by: idArraySchema.describe("A list of creator user IDs to filter by"),
            updated_by: idArraySchema.describe("A list of user IDs who updated test cases to filter by"),
            created_after: timestampSchema.optional().describe("Only return test cases created after this date (as UNIX timestamp)"),
            created_before: timestampSchema.optional().describe("Only return test cases created before this date (as UNIX timestamp)"),
            updated_after: timestampSchema.optional().describe("Only return test cases updated after this date (as UNIX timestamp)"),
            updated_before: timestampSchema.optional().describe("Only return test cases updated before this date (as UNIX timestamp)"),
            refs: z.string().optional().describe("A single Reference ID (e.g. TR-1, 4291, etc.)"),
        },
    }, async (params) => {
        try {
            // Convert snake_case to camelCase for API
            const options = Object.entries(params)
                .filter(([key, value]) => key !== "project_id" && value !== undefined)
                .reduce((acc, [key, value]) => {
                const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
                // Handle special conversions
                if (key.endsWith("_after") || key.endsWith("_before")) {
                    acc[camelKey] = new Date(value * 1000);
                }
                else if (key.endsWith("_id") && Array.isArray(value)) {
                    acc[camelKey.replace("Id", "Ids")] = value;
                }
                else {
                    acc[camelKey] = value;
                }
                return acc;
            }, {});
            const testCases = await clients.cases.getCasesAdvanced(params.project_id, options);
            return {
                content: [{ type: "text", text: JSON.stringify(testCases, null, 2) }],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: "Failed to get test cases",
                            project_id: params.project_id,
                            filters: Object.keys(params).filter((k) => k !== "project_id" && params[k] !== undefined),
                            message: error.message || "Unknown error",
                            code: error.code || "UNKNOWN",
                        }, null, 2),
                    },
                ],
            };
        }
    });
    /**
     * Create a new test case in TestRail
     */
    server.registerTool("testrail_create_test_case", {
        description: "✅ Create a new test case in TestRail with full API support including custom fields, steps, and labels",
        inputSchema: {
            section_id: z.number().positive().describe("The ID of the section the test case should be added to"),
            title: z.string().min(1).describe("The title of the test case (REQUIRED)"),
            template_id: z.number().positive().optional().describe("The ID of the template (field layout)—requires TestRail 5.2 or later"),
            type_id: z.number().positive().optional().describe("The ID of the case type"),
            priority_id: z.number().positive().optional().describe("The ID of the case priority"),
            estimate: z.string().optional().describe("The estimate, e.g. '30s' or '1m 45s'"),
            milestone_id: z.number().positive().optional().describe("The ID of the milestone to link to the test case"),
            refs: z.string().optional().describe("A comma-separated list of references/requirements"),
            labels: z
                .array(z.union([z.number(), z.string()]))
                .optional()
                .describe("Array of label IDs or titles"),
            // Custom fields
            custom_preconds: z.string().optional().describe("Test preconditions"),
            custom_steps: z.string().optional().describe("Test steps (plain text)"),
            custom_expected: z.string().optional().describe("Expected result"),
            custom_steps_separated: z
                .array(z.object({
                content: z.string().optional().describe("Step action"),
                expected: z.string().optional().describe("Expected result"),
                shared_step_id: z.number().positive().optional().describe("ID of shared step to include"),
            }))
                .optional()
                .describe("Structured test steps"),
            custom_mission: z.string().optional().describe("Mission (for exploratory tests)"),
            custom_goals: z.string().optional().describe("Goals (for exploratory tests)"),
        },
    }, async (args) => {
        try {
            const { section_id, ...testCaseData } = args;
            // Create the test case using the API
            const result = await clients.cases.addCase(section_id, testCaseData);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: error instanceof Error ? error.message : "Unknown error",
                            details: "Failed to create test case",
                        }, null, 2),
                    },
                ],
            };
        }
    });
    /**
     * Copy test cases to another section
     */
    server.registerTool("testrail_copy_test_cases", {
        description: "📋 Copy test cases to another section (creates duplicates, originals remain)",
        inputSchema: {
            case_ids: z.array(z.number()).describe("Array of test case IDs to copy"),
            target_section_id: z.number().describe("Target section ID where cases will be copied"),
            confirmation: z.literal("I_UNDERSTAND_THIS_CREATES_DUPLICATES").describe("Confirmation that you understand this creates duplicates"),
        },
    }, async ({ case_ids, target_section_id, confirmation }) => {
        const results = [];
        let successCount = 0;
        let errorCount = 0;
        for (const caseId of case_ids) {
            try {
                // Get the original case
                const originalCase = await clients.cases.getCase(caseId);
                // Create a copy in the target section
                const copiedCase = await clients.cases.addCase(target_section_id, {
                    title: `${originalCase.title} (Copy)`,
                    type_id: originalCase.type_id,
                    priority_id: originalCase.priority_id,
                    estimate: originalCase.estimate,
                    refs: originalCase.refs,
                    custom_preconds: originalCase.custom_preconds,
                    custom_steps: originalCase.custom_steps,
                    custom_expected: originalCase.custom_expected,
                    custom_steps_separated: originalCase.custom_steps_separated,
                    custom_mission: originalCase.custom_mission,
                    custom_goals: originalCase.custom_goals,
                });
                results.push(`✅ Copied case ${caseId}: "${originalCase.title}" → ID: ${copiedCase.id}`);
                successCount++;
            }
            catch (error) {
                results.push(`❌ Failed to copy case ${caseId}: ${error instanceof Error ? error.message : "Unknown error"}`);
                errorCount++;
            }
        }
        return {
            content: [
                {
                    type: "text",
                    text: `# 📋 COPY OPERATION COMPLETED\n\n` + `**Summary:**\n` + `✅ Successfully copied: ${successCount} test cases\n` + `❌ Failed: ${errorCount} test cases\n\n` + `**Target Section:** ${target_section_id}\n\n` + `**Details:**\n${results.join("\n")}\n\n` + `💡 **Note:** Original test cases remain unchanged. Copies were created with "(Copy)" suffix.`,
                },
            ],
        };
    });
    /**
     * Move test cases to another section/suite
     */
    server.registerTool("testrail_move_test_cases", {
        description: "🚛 Move test cases to another section/suite (removes from original location)",
        inputSchema: {
            case_ids: z.array(z.number()).describe("Array of test case IDs to move"),
            target_section_id: z.number().describe("Target section ID where cases will be moved"),
            target_suite_id: z.number().describe("Target suite ID where cases will be moved"),
            confirmation: z.literal("I_UNDERSTAND_THIS_MOVES_CASES_PERMANENTLY").describe("Confirmation that you understand this moves cases permanently"),
        },
    }, async ({ case_ids, target_section_id, target_suite_id, confirmation }) => {
        const results = [];
        let successCount = 0;
        let errorCount = 0;
        for (const caseId of case_ids) {
            try {
                // Update the case's section
                await clients.cases.updateCase(caseId, {
                    section_id: target_section_id,
                });
                results.push(`✅ Moved case ${caseId} to section ${target_section_id}`);
                successCount++;
            }
            catch (error) {
                results.push(`❌ Failed to move case ${caseId}: ${error instanceof Error ? error.message : "Unknown error"}`);
                errorCount++;
            }
        }
        return {
            content: [
                {
                    type: "text",
                    text: `# 🚛 MOVE OPERATION COMPLETED\n\n` + `**Summary:**\n` + `✅ Successfully moved: ${successCount} test cases\n` + `❌ Failed: ${errorCount} test cases\n\n` + `**Target Location:**\n` + `- Suite ID: ${target_suite_id}\n` + `- Section ID: ${target_section_id}\n\n` + `**Details:**\n${results.join("\n")}\n\n` + `💡 **Note:** Test cases have been permanently moved from their original location.`,
                },
            ],
        };
    });
    /**
     * Update an existing test case in TestRail
     */
    server.registerTool("testrail_update_test_case", {
        description: "✅ Update an existing test case in TestRail with partial updates support - only submit fields you want to change",
        inputSchema: {
            case_id: caseIdSchema,
            // Optional fields that can be updated (same as add_case)
            section_id: z.number().positive().optional().describe("The ID of the section the test case should be moved to (requires TestRail 6.5.2+)"),
            title: z.string().min(1).optional().describe("The title of the test case"),
            template_id: z.number().positive().optional().describe("The ID of the template (field layout)—requires TestRail 5.2 or later"),
            type_id: z.number().positive().optional().describe("The ID of the case type"),
            priority_id: z.number().positive().optional().describe("The ID of the case priority"),
            estimate: z.string().optional().describe("The estimate, e.g. '30s' or '1m 45s'"),
            milestone_id: z.number().positive().optional().describe("The ID of the milestone to link to the test case"),
            refs: z.string().optional().describe("A comma-separated list of references/requirements"),
            labels: z
                .array(z.union([z.number(), z.string()]))
                .optional()
                .describe("Array of label IDs or titles"),
            // Custom fields
            custom_preconds: z.string().optional().describe("Test preconditions"),
            custom_steps: z.string().optional().describe("Test steps (plain text)"),
            custom_expected: z.string().optional().describe("Expected result"),
            custom_steps_separated: z
                .array(z.object({
                content: z.string().optional().describe("Step action"),
                expected: z.string().optional().describe("Expected result"),
                shared_step_id: z.number().positive().optional().describe("ID of shared step to include"),
            }))
                .optional()
                .describe("Structured test steps"),
            custom_mission: z.string().optional().describe("Mission (for exploratory tests)"),
            custom_goals: z.string().optional().describe("Goals (for exploratory tests)"),
        },
    }, async (args) => {
        try {
            const { case_id, ...updateData } = args;
            // Filter out undefined values for partial updates
            const filteredData = Object.entries(updateData)
                .filter(([_, value]) => value !== undefined)
                .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});
            // Update the test case using the API
            const result = await clients.cases.updateCase(case_id, filteredData);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: error instanceof Error ? error.message : "Unknown error",
                            case_id: args.case_id,
                            details: "Failed to update test case",
                            updated_fields: Object.keys(args).filter((k) => k !== "case_id" && args[k] !== undefined),
                        }, null, 2),
                    },
                ],
            };
        }
    });
    /**
     * Batch update test cases
     */
    server.registerTool("testrail_update_test_cases_batch", {
        description: "🔄 Update multiple test cases with the same values (e.g., change priority for multiple cases)",
        inputSchema: {
            suite_id: z.number().describe("Suite ID containing the test cases"),
            case_ids: z.array(z.number()).describe("Array of test case IDs to update"),
            updates: z
                .object({
                priority_id: z.number().optional().describe("New priority ID - use get_case_metadata to see valid IDs"),
                priority_short_name: z.string().optional().describe("New priority short name (e.g., '3' for '3 - Must Test')"),
                type_id: z.number().optional().describe("New case type ID"),
                estimate: z.string().optional().describe("New time estimate (e.g., '30m', '1h 30m')"),
                milestone_id: z.number().optional().describe("New milestone ID"),
                refs: z.string().optional().describe("New references/requirements"),
            })
                .describe("Fields to update with new values"),
            confirmation: z.literal("I_HAVE_REVIEWED_THE_CASE_IDS_TO_UPDATE").describe("Confirmation that you have reviewed the case IDs"),
        },
    }, async ({ suite_id, case_ids, updates, confirmation }) => {
        const results = [];
        let successCount = 0;
        let errorCount = 0;
        // Resolve priority_short_name to priority_id if provided
        let finalUpdates = { ...updates };
        if (updates.priority_short_name) {
            if (!clients.priorities) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `❌ **Priority resolution not available**\n\nPriorities client not initialized. Use priority_id instead of priority_short_name.`,
                        },
                    ],
                };
            }
            try {
                const priority = await clients.priorities.getPriorityByShortName(updates.priority_short_name);
                if (priority) {
                    finalUpdates.priority_id = priority.id;
                    delete finalUpdates.priority_short_name;
                }
                else {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `❌ **Priority short name "${updates.priority_short_name}" not found**\n\nAvailable priorities can be viewed with get_case_metadata tool.`,
                            },
                        ],
                    };
                }
            }
            catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `❌ **Failed to resolve priority short name "${updates.priority_short_name}"**\n\nError: ${error instanceof Error ? error.message : "Unknown error"}`,
                        },
                    ],
                };
            }
        }
        // Build update summary
        const updateSummary = Object.entries(finalUpdates)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => {
            if (key === "priority_id") {
                return `Priority ID → ${value}`;
            }
            return `${key} → ${value}`;
        })
            .join(", ");
        for (const caseId of case_ids) {
            try {
                await clients.cases.updateCase(caseId, finalUpdates);
                results.push(`✅ Updated case ${caseId}`);
                successCount++;
            }
            catch (error) {
                results.push(`❌ Failed to update case ${caseId}: ${error instanceof Error ? error.message : "Unknown error"}`);
                errorCount++;
            }
        }
        return {
            content: [
                {
                    type: "text",
                    text: `# 🔄 BATCH UPDATE COMPLETED\n\n` + `**Summary:**\n` + `✅ Successfully updated: ${successCount} test cases\n` + `❌ Failed: ${errorCount} test cases\n\n` + `**Updates Applied:** ${updateSummary}\n` + `**Suite ID:** ${suite_id}\n\n` + `**Details:**\n${results.join("\n")}\n\n` + `💡 **Note:** Changes have been applied to all successfully updated test cases.`,
                },
            ],
        };
    });
    /**
     * Delete test case with confirmation - CRITICAL OPERATION
     */
    server.registerTool("testrail_delete_test_case", {
        description: "🚨 DELETE a test case from TestRail. This is IRREVERSIBLE! Use with extreme caution.",
        inputSchema: {
            case_id: z.number().describe("The ID of the test case to delete"),
            confirmation: z.literal("I_UNDERSTAND_THIS_IS_IRREVERSIBLE_DELETE").describe("Explicit confirmation for deletion"),
            reason: z.string().min(10).describe("Reason for deletion (minimum 10 characters) - required for audit purposes"),
        },
    }, async ({ case_id, confirmation, reason }) => {
        let testCase = null;
        try {
            // First get the test case details to show what's being deleted
            testCase = await clients.cases.getCase(case_id);
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `❌ **Cannot retrieve test case ${case_id}**\n\n` + `Error: ${error instanceof Error ? error.message : "Unknown error"}\n\n` + `The test case may not exist or you may not have permission to view it.`,
                    },
                ],
            };
        }
        try {
            // Delete the test case - this may return empty response which is normal
            await clients.cases.deleteCase(case_id);
            return {
                content: [
                    {
                        type: "text",
                        text: `# 🗑️ TEST CASE DELETED\n\n` + `**Deleted Test Case:**\n` + `- ID: ${testCase.id}\n` + `- Title: "${testCase.title}"\n` + `- Section: ${testCase.section_id}\n\n` + `**Deletion Details:**\n` + `- Timestamp: ${new Date().toISOString()}\n` + `- Reason: ${reason}\n\n` + `⚠️ **This action is IRREVERSIBLE!**\n` + `The test case has been permanently removed from TestRail.`,
                    },
                ],
            };
        }
        catch (error) {
            // Check if it's just a JSON parse error (which might mean successful deletion)
            if (error instanceof Error && error.message.includes("Unexpected end of JSON input")) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `# 🗑️ TEST CASE LIKELY DELETED\n\n` + `**Deleted Test Case:**\n` + `- ID: ${testCase.id}\n` + `- Title: "${testCase.title}"\n` + `- Section: ${testCase.section_id}\n\n` + `**Deletion Details:**\n` + `- Timestamp: ${new Date().toISOString()}\n` + `- Reason: ${reason}\n\n` + `⚠️ **Note:** TestRail API returned empty response (normal for DELETE operations).\n` + `The test case has likely been successfully removed from TestRail.`,
                        },
                    ],
                };
            }
            return {
                content: [
                    {
                        type: "text",
                        text: `❌ **Failed to delete test case ${case_id}**\n\n` + `Error: ${error instanceof Error ? error.message : "Unknown error"}\n\n` + `The test case may not exist or you may not have permission to delete it.`,
                    },
                ],
            };
        }
    });
    /**
     * Create a new custom field for test cases
     */
    server.registerTool("testrail_add_case_field", {
        description: "Creates a new test case custom field in TestRail.",
        inputSchema: {
            type: z.string().min(1).describe("The type identifier for the new custom field (e.g. 'String', 'Dropdown', '12')"),
            name: z.string().min(1).describe("The name for new custom field (without 'custom_' prefix)"),
            label: z.string().min(1).describe("The label for the new custom field"),
            description: z.string().optional().describe("The description for the new custom field"),
            include_all: z.boolean().optional().describe("Set true to include for all templates, false to specify template_ids"),
            template_ids: z.array(z.number()).optional().describe("IDs of templates new custom field will apply to if include_all is false"),
            configs: z
                .array(z.object({
                context: z.object({
                    is_global: z.boolean(),
                    project_ids: z.union([z.array(z.number()), z.string(), z.null()]),
                }),
                options: z.record(z.any()),
            }))
                .describe("Array of configs with context and options"),
        },
    }, async (args) => {
        try {
            const result = await clients.caseFields.addCaseField(args);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({ error: error.message || "Unknown error", details: "Failed to add case field" }, null, 2),
                    },
                ],
            };
        }
    });
    /**
     * Get available test case custom fields
     */
    server.registerTool("testrail_get_case_fields", {
        description: "Returns a list of available test case custom fields, including configs and type info.",
        inputSchema: {},
    }, async () => {
        try {
            const fields = await clients.caseFields.getCaseFields();
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(fields, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({ error: error.message || "Unknown error", details: "Failed to get case fields" }, null, 2),
                    },
                ],
            };
        }
    });
}
//# sourceMappingURL=case-tools.js.map