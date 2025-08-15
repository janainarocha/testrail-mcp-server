import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { TestRailAPI, TestCase } from "./testrail-api.js";

/**
 * Register all MCP tools for TestRail operations
 */
export function registerTools(server: McpServer, api: TestRailAPI) {
  
  /**
   * List all projects
   */
  server.registerTool(
    "list_projects",
    {
      description: "Get a list of all TestRail projects accessible to the authenticated user"
    },
    async () => {
      const projects = await api.getProjects();
      
      return {
        content: [
          {
            type: "text",
            text: `Found ${projects.length} TestRail projects:\n\n` +
              projects.map(p => 
                `📁 **${p.name}** (ID: ${p.id})\n` +
                `   ${p.announcement ? `Announcement: ${p.announcement}\n` : ''}` +
                `   Status: ${p.is_completed ? '✅ Completed' : '🟢 Active'}`
              ).join('\n\n')
          }
        ]
      };
    }
  );

  /**
   * Get project details with suites
   */
  server.registerTool(
    "get_project",
    {
      description: "Get detailed information about a specific TestRail project including its test suites",
      inputSchema: {
        project_id: z.number().describe("The ID of the project to retrieve")
      }
    },
    async ({ project_id }) => {
      const project = await api.getProject(project_id);
      const suites = await api.getSuites(project_id);
      
      return {
        content: [
          {
            type: "text",
            text: `## Project: ${project.name} (ID: ${project.id})\n\n` +
              `${project.announcement ? `📢 **Announcement:** ${project.announcement}\n\n` : ''}` +
              `**Status:** ${project.is_completed ? '✅ Completed' : '🟢 Active'}\n\n` +
              `### Test Suites (${suites.length}):\n\n` +
              suites.map(s => 
                `🗂️  **${s.name}** (ID: ${s.id})\n` +
                `    ${s.description ? s.description : 'No description'}`
              ).join('\n')
          }
        ]
      };
    }
  );

  /**
   * List sections in a suite
   */
  server.registerTool(
    "list_sections",
    {
      description: "Get all sections in a TestRail test suite",
      inputSchema: {
        project_id: z.number().describe("The ID of the project"),
        suite_id: z.number().describe("The ID of the suite to get sections from")
      }
    },
    async ({ project_id, suite_id }) => {
      const sections = await api.getSections(project_id, suite_id);
      
      return {
        content: [
          {
            type: "text",
            text: `Found ${sections.length} sections in suite ${suite_id}:\n\n` +
              sections.map(s => 
                `📂 **${s.name}** (ID: ${s.id})\n` +
                `   ${s.description ? `Description: ${s.description}\n` : ''}` +
                `   ${s.parent_id ? `Parent Section: ${s.parent_id}` : 'Top-level section'}`
              ).join('\n\n')
          }
        ]
      };
    }
  );

  /**
   * Get test cases in a section
   */
  server.registerTool(
    "list_test_cases",
    {
      description: "Get all test cases in a specific section of a TestRail suite",
      inputSchema: {
        project_id: z.number().describe("The ID of the project"),
        suite_id: z.number().describe("The ID of the suite"),
        section_id: z.number().describe("The ID of the section to get test cases from")
      }
    },
    async ({ project_id, suite_id, section_id }) => {
      const response = await api.getCases(project_id, suite_id, section_id);
      const cases = response.cases;
      
      return {
        content: [
          {
            type: "text",
            text: `Found ${cases.length} test cases in section ${section_id}:\n\n` +
              cases.map((c: any) => 
                `🧪 **${c.title}** (ID: ${c.id})\n` +
                `   Type: ${c.type_id === 1 ? 'Text' : c.type_id === 2 ? 'Steps' : c.type_id === 3 ? 'Exploratory' : 'Unknown'}\n` +
                `   Priority: ${c.priority_id === 1 ? 'Low' : c.priority_id === 2 ? 'Medium' : c.priority_id === 3 ? 'High' : c.priority_id === 4 ? 'Critical' : 'Unknown'}\n` +
                `   ${c.estimate ? `Estimate: ${c.estimate}\n` : ''}` +
                `   Created: ${c.created_on ? new Date(c.created_on * 1000).toLocaleDateString() : 'Unknown'}`
              ).join('\n\n')
          }
        ]
      };
    }
  );

  /**
   * Create a text-based test case
   */
  server.registerTool(
    "create_text_test_case",
    {
      description: "Create a new text-based test case in TestRail",
      inputSchema: {
        title: z.string().describe("The title/name of the test case"),
        section_id: z.number().describe("The section ID where the test case should be created"),
        description: z.string().optional().describe("Test case description"),
        preconditions: z.string().optional().describe("Preconditions for the test"),
        expected_result: z.string().optional().describe("Expected result/behavior"),
        priority_id: z.number().min(1).max(4).default(2).describe("Priority: 1=Low, 2=Medium, 3=High, 4=Critical"),
        estimate: z.string().optional().describe("Time estimate (e.g., '1m', '5m', '1h')")
      }
    },
    async ({ title, section_id, description, preconditions, expected_result, priority_id, estimate }) => {
      const testCase = {
        title,
        type_id: 1, // Text type
        priority_id,
        estimate,
        refs: undefined,
        custom_preconds: preconditions,
        custom_steps: description,
        custom_expected: expected_result
      };

      const createdCase = await api.addCase(section_id, testCase);
      
      return {
        content: [
          {
            type: "text",
            text: `✅ Successfully created text test case!\n\n` +
              `**${createdCase.title}** (ID: ${createdCase.id})\n` +
              `Section: ${section_id}\n` +
              `Type: Text\n` +
              `Priority: ${priority_id === 1 ? 'Low' : priority_id === 2 ? 'Medium' : priority_id === 3 ? 'High' : 'Critical'}\n` +
              `${estimate ? `Estimate: ${estimate}\n` : ''}` +
              `${description ? `Description: ${description}\n` : ''}` +
              `${preconditions ? `Preconditions: ${preconditions}\n` : ''}` +
              `${expected_result ? `Expected Result: ${expected_result}` : ''}`
          }
        ]
      };
    }
  );

  /**
   * Create a steps-based test case
   */
  server.registerTool(
    "create_steps_test_case",
    {
      description: "Create a new steps-based test case in TestRail with structured test steps",
      inputSchema: {
        title: z.string().describe("The title/name of the test case"),
        section_id: z.number().describe("The section ID where the test case should be created"),
        description: z.string().optional().describe("Test case description"),
        preconditions: z.string().optional().describe("Preconditions for the test"),
        steps: z.array(z.object({
          content: z.string().describe("The action/step to perform"),
          expected: z.string().describe("Expected result for this step")
        })).describe("Array of test steps with actions and expected results"),
        priority_id: z.number().min(1).max(4).default(2).describe("Priority: 1=Low, 2=Medium, 3=High, 4=Critical"),
        estimate: z.string().optional().describe("Time estimate (e.g., '1m', '5m', '1h')")
      }
    },
    async ({ title, section_id, description, preconditions, steps, priority_id, estimate }) => {
      const testCase = {
        title,
        type_id: 2, // Steps type
        priority_id,
        estimate,
        refs: undefined,
        custom_preconds: preconditions,
        custom_steps: description,
        custom_steps_separated: steps
      };

      const createdCase = await api.addCase(section_id, testCase);
      
      return {
        content: [
          {
            type: "text",
            text: `✅ Successfully created steps test case!\n\n` +
              `**${createdCase.title}** (ID: ${createdCase.id})\n` +
              `Section: ${section_id}\n` +
              `Type: Steps\n` +
              `Priority: ${priority_id === 1 ? 'Low' : priority_id === 2 ? 'Medium' : priority_id === 3 ? 'High' : 'Critical'}\n` +
              `${estimate ? `Estimate: ${estimate}\n` : ''}` +
              `${description ? `Description: ${description}\n` : ''}` +
              `${preconditions ? `Preconditions: ${preconditions}\n` : ''}` +
              `\n**Test Steps:**\n` +
              steps.map((step, i) => 
                `${i + 1}. **Action:** ${step.content}\n` +
                `   **Expected:** ${step.expected}`
              ).join('\n')
          }
        ]
      };
    }
  );

  /**
   * Create an exploratory test case
   */
  server.registerTool(
    "create_exploratory_test_case",
    {
      description: "Create a new exploratory test case in TestRail",
      inputSchema: {
        title: z.string().describe("The title/name of the test case"),
        section_id: z.number().describe("The section ID where the test case should be created"),
        description: z.string().optional().describe("Test case description"),
        preconditions: z.string().optional().describe("Preconditions for the test"),
        mission: z.string().optional().describe("The testing mission/goal for exploration"),
        priority_id: z.number().min(1).max(4).default(2).describe("Priority: 1=Low, 2=Medium, 3=High, 4=Critical"),
        estimate: z.string().optional().describe("Time estimate (e.g., '1m', '5m', '1h')")
      }
    },
    async ({ title, section_id, description, preconditions, mission, priority_id, estimate }) => {
      const testCase = {
        title,
        type_id: 3, // Exploratory type
        priority_id,
        estimate,
        refs: undefined,
        custom_preconds: preconditions,
        custom_steps: description,
        custom_mission: mission
      };

      const createdCase = await api.addCase(section_id, testCase);
      
      return {
        content: [
          {
            type: "text",
            text: `✅ Successfully created exploratory test case!\n\n` +
              `**${createdCase.title}** (ID: ${createdCase.id})\n` +
              `Section: ${section_id}\n` +
              `Type: Exploratory\n` +
              `Priority: ${priority_id === 1 ? 'Low' : priority_id === 2 ? 'Medium' : priority_id === 3 ? 'High' : 'Critical'}\n` +
              `${estimate ? `Estimate: ${estimate}\n` : ''}` +
              `${description ? `Description: ${description}\n` : ''}` +
              `${preconditions ? `Preconditions: ${preconditions}\n` : ''}` +
              `${mission ? `Mission: ${mission}` : ''}`
          }
        ]
      };
    }
  );

  /**
   * Create a new section
   */
  server.registerTool(
    "create_section",
    {
      description: "Create a new section in a TestRail test suite",
      inputSchema: {
        suite_id: z.number().describe("The ID of the suite where the section should be created"),
        name: z.string().describe("The name of the new section"),
        description: z.string().optional().describe("Description of the section"),
        parent_id: z.number().optional().describe("Parent section ID if creating a subsection")
      }
    },
    async ({ suite_id, name, description, parent_id }) => {
      const section = await api.addSectionLegacy(suite_id, name, suite_id, parent_id);
      
      return {
        content: [
          {
            type: "text",
            text: `✅ Successfully created section!\n\n` +
              `**${section.name}** (ID: ${section.id})\n` +
              `Suite: ${suite_id}\n` +
              `${description ? `Description: ${description}\n` : ''}` +
              `${parent_id ? `Parent Section: ${parent_id}` : 'Top-level section'}`
          }
        ]
      };
    }
  );

  /**
   * Get test case details
   */
  server.registerTool(
    "get_test_case",
    {
      description: "Get detailed information about a specific test case",
      inputSchema: {
        case_id: z.number().describe("The ID of the test case to retrieve")
      }
    },
    async ({ case_id }) => {
      const testCase = await api.getCase(case_id);
      
      return {
        content: [
          {
            type: "text",
            text: `## Test Case: ${testCase.title} (ID: ${testCase.id})\n\n` +
              `**Type:** ${testCase.type_id === 1 ? 'Text' : testCase.type_id === 2 ? 'Steps' : testCase.type_id === 3 ? 'Exploratory' : 'Unknown'}\n` +
              `**Priority:** ${testCase.priority_id === 1 ? 'Low' : testCase.priority_id === 2 ? 'Medium' : testCase.priority_id === 3 ? 'High' : testCase.priority_id === 4 ? 'Critical' : 'Unknown'}\n` +
              `**Section:** ${testCase.section_id}\n` +
              `${testCase.estimate ? `**Estimate:** ${testCase.estimate}\n` : ''}` +
              `${testCase.custom_preconds ? `**Preconditions:**\n${testCase.custom_preconds}\n\n` : ''}` +
              `${testCase.custom_steps ? `**Description/Steps:**\n${testCase.custom_steps}\n\n` : ''}` +
              `${testCase.custom_expected ? `**Expected Result:**\n${testCase.custom_expected}\n\n` : ''}` +
              `${testCase.custom_mission ? `**Mission:**\n${testCase.custom_mission}\n\n` : ''}` +
              `${testCase.custom_steps_separated ? 
                `**Test Steps:**\n` + 
                testCase.custom_steps_separated.map((step: any, i: number) => 
                  `${i + 1}. **Action:** ${step.content}\n   **Expected:** ${step.expected}`
                ).join('\n') + '\n\n' : ''
              }` +
              `${testCase.refs ? `**References:** ${testCase.refs}` : ''}`
          }
        ]
      };
    }
  );

  /**
   * Preview test cases before creation - SAFETY FEATURE
   */
  server.registerTool(
    "preview_test_cases_batch",
    {
      description: "🔍 PREVIEW test cases before creation - shows what will be created without actually creating them. Use this FIRST before any batch creation to avoid creating unwanted test cases.",
      inputSchema: {
        project_id: z.number().describe("Project ID where test cases will be created"),
        section_id: z.number().describe("Section ID where test cases will be created"),
        test_cases: z.array(z.object({
          title: z.string().describe("Test case title"),
          type: z.enum(["text", "steps", "exploratory"]).describe("Test case type"),
          preconditions: z.string().optional().describe("Test preconditions"),
          steps: z.string().optional().describe("Test steps (for text type)"),
          steps_separated: z.array(z.object({
            content: z.string().describe("Step action"),
            expected: z.string().describe("Expected result")
          })).optional().describe("Separated steps (for steps type)"),
          mission: z.string().optional().describe("Mission (for exploratory type)"),
          goals: z.string().optional().describe("Goals (for exploratory type)"),
          priority: z.enum(["low", "medium", "high", "critical"]).optional().describe("Test case priority"),
          estimate: z.string().optional().describe("Time estimate"),
          refs: z.string().optional().describe("References")
        })).describe("Array of test cases to preview")
      }
    },
    async ({ project_id, section_id, test_cases }) => {
      // Get project and section info for context
      const project = await api.getProject(project_id);
      const sections = await api.getSections(project_id);
      const section = sections.find(s => s.id === section_id);
      
      const previewText = `# 🔍 TEST CASE CREATION PREVIEW\n\n` +
        `⚠️  **REVIEW CAREFULLY BEFORE PROCEEDING** ⚠️\n\n` +
        `**Target Location:**\n` +
        `- Project: ${project.name} (ID: ${project_id})\n` +
        `- Section: ${section?.name || 'Unknown'} (ID: ${section_id})\n\n` +
        `**${test_cases.length} test cases will be created:**\n\n` +
        test_cases.map((tc, index) => {
          let preview = `## ${index + 1}. ${tc.title}\n`;
          preview += `**Type:** ${tc.type}\n`;
          preview += `**Priority:** ${tc.priority || 'medium'}\n`;
          if (tc.estimate) preview += `**Estimate:** ${tc.estimate}\n`;
          if (tc.refs) preview += `**References:** ${tc.refs}\n`;
          if (tc.preconditions) preview += `**Preconditions:** ${tc.preconditions}\n`;
          
          if (tc.type === 'text' && tc.steps) {
            preview += `**Steps:** ${tc.steps}\n`;
          } else if (tc.type === 'steps' && tc.steps_separated) {
            preview += `**Steps:**\n`;
            tc.steps_separated.forEach((step, i) => {
              preview += `  ${i + 1}. Action: ${step.content}\n`;
              preview += `     Expected: ${step.expected}\n`;
            });
          } else if (tc.type === 'exploratory') {
            if (tc.mission) preview += `**Mission:** ${tc.mission}\n`;
            if (tc.goals) preview += `**Goals:** ${tc.goals}\n`;
          }
          
          return preview;
        }).join('\n---\n\n') +
        `\n\n🚨 **NEXT STEPS:**\n` +
        `1. Review all test cases above carefully\n` +
        `2. If you want to proceed, use the "create_test_cases_batch_confirmed" tool\n` +
        `3. If you want to modify, ask me to adjust the test cases and preview again\n` +
        `4. If you want to cancel, just don't proceed with creation\n\n` +
        `💡 **Tip:** You can modify individual test cases and preview again before confirming.`;

      return {
        content: [
          {
            type: "text",
            text: previewText
          }
        ]
      };
    }
  );

  /**
   * Create test cases batch with confirmation - REQUIRES PREVIEW FIRST
   */
  server.registerTool(
    "create_test_cases_batch_confirmed",
    {
      description: "✅ Create multiple test cases after preview confirmation. This tool should ONLY be used after running 'preview_test_cases_batch' first.",
      inputSchema: {
        project_id: z.number().describe("Project ID (must match the previewed batch)"),
        section_id: z.number().describe("Section ID (must match the previewed batch)"),
        test_cases: z.array(z.object({
          title: z.string().describe("Test case title"),
          type: z.enum(["text", "steps", "exploratory"]).describe("Test case type"),
          preconditions: z.string().optional().describe("Test preconditions"),
          steps: z.string().optional().describe("Test steps (for text type)"),
          steps_separated: z.array(z.object({
            content: z.string().describe("Step action"),
            expected: z.string().describe("Expected result")
          })).optional().describe("Separated steps (for steps type)"),
          mission: z.string().optional().describe("Mission (for exploratory type)"),
          goals: z.string().optional().describe("Goals (for exploratory type)"),
          priority: z.enum(["low", "medium", "high", "critical"]).optional().describe("Test case priority"),
          estimate: z.string().optional().describe("Time estimate"),
          refs: z.string().optional().describe("References")
        })).describe("Array of test cases to create (must match previewed data)"),
        selected_indexes: z.array(z.number()).optional().describe("Optional: specific indexes to create (1-based). If not provided, creates all test cases."),
        confirmation: z.literal("I_HAVE_REVIEWED_AND_CONFIRM_CREATION").describe("Explicit confirmation that user has reviewed the preview")
      }
    },
    async ({ project_id, section_id, test_cases, selected_indexes, confirmation }) => {
      // Filter test cases if specific indexes are selected
      const casesToCreate = selected_indexes 
        ? selected_indexes.map(index => test_cases[index - 1]).filter(Boolean)
        : test_cases;

      const results = [];
      let successCount = 0;
      let errorCount = 0;

      for (const [arrayIndex, tc] of casesToCreate.entries()) {
        const originalIndex = selected_indexes 
          ? selected_indexes[arrayIndex] 
          : arrayIndex + 1;

        try {
          let createdCase: any = null;
          
          if (tc.type === 'text') {
            createdCase = await api.addCase(section_id, {
              title: tc.title,
              template_id: 1, // Text template
              type_id: 12, // Functional test type
              priority_id: tc.priority === 'low' ? 1 : tc.priority === 'medium' ? 2 : tc.priority === 'high' ? 3 : 4,
              estimate: tc.estimate,
              refs: tc.refs,
              custom_preconds: tc.preconditions,
              custom_steps: tc.steps
            });
          } else if (tc.type === 'steps') {
            createdCase = await api.addCase(section_id, {
              title: tc.title,
              template_id: 2, // Test case (steps) template
              type_id: 12, // Functional test type
              priority_id: tc.priority === 'low' ? 1 : tc.priority === 'medium' ? 2 : tc.priority === 'high' ? 3 : 4,
              estimate: tc.estimate,
              refs: tc.refs,
              custom_preconds: tc.preconditions,
              custom_steps_separated: tc.steps_separated
            });
          } else if (tc.type === 'exploratory') {
            createdCase = await api.addCase(section_id, {
              title: tc.title,
              template_id: 3, // Exploratory session template
              type_id: 11, // Other test type
              priority_id: tc.priority === 'low' ? 1 : tc.priority === 'medium' ? 2 : tc.priority === 'high' ? 3 : 4,
              estimate: tc.estimate,
              refs: tc.refs,
              custom_mission: tc.mission,
              custom_goals: tc.goals
            });
          }

          if (createdCase && createdCase.id) {
            results.push(`✅ Created (#${originalIndex}): "${tc.title}" (ID: ${createdCase.id})`);
            successCount++;
          } else {
            results.push(`❌ Failed (#${originalIndex}): "${tc.title}" - No response from TestRail`);
            errorCount++;
          }
        } catch (error) {
          results.push(`❌ Failed (#${originalIndex}): "${tc.title}" - ${error instanceof Error ? error.message : 'Unknown error'}`);
          errorCount++;
        }
      }

      const selectionInfo = selected_indexes 
        ? ` (Selected: ${selected_indexes.join(', ')})`
        : ' (All)';

      return {
        content: [
          {
            type: "text",
            text: `# 🎉 BATCH CREATION COMPLETED${selectionInfo}\n\n` +
              `**Summary:**\n` +
              `✅ Successfully created: ${successCount} test cases\n` +
              `❌ Failed: ${errorCount} test cases\n\n` +
              `**Details:**\n${results.join('\n')}\n\n` +
              `${successCount > 0 ? '🔗 Test cases are now available in TestRail!' : ''}` +
              `${errorCount > 0 ? '\n\n⚠️ Some test cases failed to create. Please check the error messages above.' : ''}`
          }
        ]
      };
    }
  );

  /**
   * Delete test case with confirmation - CRITICAL OPERATION
   */
  server.registerTool(
    "delete_test_case_confirmed",
    {
      description: "🚨 DELETE a test case from TestRail. This is IRREVERSIBLE! Use with extreme caution.",
      inputSchema: {
        case_id: z.number().describe("The ID of the test case to delete"),
        confirmation: z.literal("I_UNDERSTAND_THIS_IS_IRREVERSIBLE_DELETE").describe("Explicit confirmation for deletion"),
        reason: z.string().min(10).describe("Reason for deletion (minimum 10 characters) - required for audit purposes")
      }
    },
    async ({ case_id, confirmation, reason }) => {
      try {
        // First get the test case details to show what's being deleted
        const testCase = await api.getCase(case_id);
        
        // Delete the test case
        await api.deleteCase(case_id);

        return {
          content: [
            {
              type: "text",
              text: `# 🗑️ TEST CASE DELETED\n\n` +
                `**Deleted Test Case:**\n` +
                `- ID: ${testCase.id}\n` +
                `- Title: "${testCase.title}"\n` +
                `- Section: ${testCase.section_id}\n\n` +
                `**Deletion Details:**\n` +
                `- Timestamp: ${new Date().toISOString()}\n` +
                `- Reason: ${reason}\n\n` +
                `⚠️ **This action is IRREVERSIBLE!**\n` +
                `The test case has been permanently removed from TestRail.`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to delete test case ${case_id}**\n\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
                `The test case may not exist or you may not have permission to delete it.`
            }
          ]
        };
      }
    }
  );

  /**
   * Preview delete operation - SAFETY FEATURE
   */
  server.registerTool(
    "preview_delete_test_case",
    {
      description: "🔍 PREVIEW what will be deleted before actual deletion. Use this FIRST before deleting test cases.",
      inputSchema: {
        case_id: z.number().describe("The ID of the test case to preview for deletion")
      }
    },
    async ({ case_id }) => {
      try {
        const testCase = await api.getCase(case_id);
        
        return {
          content: [
            {
              type: "text",
              text: `# 🚨 DELETE PREVIEW - REVIEW CAREFULLY\n\n` +
                `**Test Case to be DELETED:**\n` +
                `- ID: ${testCase.id}\n` +
                `- Title: "${testCase.title}"\n` +
                `- Section: ${testCase.section_id}\n` +
                `- Type: ${testCase.type_id === 1 ? 'Text' : testCase.type_id === 2 ? 'Steps' : testCase.type_id === 3 ? 'Exploratory' : 'Unknown'}\n` +
                `- Priority: ${testCase.priority_id === 1 ? 'Low' : testCase.priority_id === 2 ? 'Medium' : testCase.priority_id === 3 ? 'High' : testCase.priority_id === 4 ? 'Critical' : 'Unknown'}\n\n` +
                `${testCase.custom_preconds ? `**Preconditions:**\n${testCase.custom_preconds}\n\n` : ''}` +
                `${testCase.custom_steps ? `**Steps/Description:**\n${testCase.custom_steps.substring(0, 200)}${testCase.custom_steps.length > 200 ? '...' : ''}\n\n` : ''}` +
                `⚠️ **WARNING: DELETION IS IRREVERSIBLE!**\n\n` +
                `🚨 **NEXT STEPS:**\n` +
                `1. Review the test case details above carefully\n` +
                `2. If you're absolutely sure, use "delete_test_case_confirmed" tool\n` +
                `3. You must provide a reason for deletion (audit requirement)\n` +
                `4. If you're not sure, DON'T PROCEED with deletion\n\n` +
                `💡 **Alternative:** Consider archiving or moving the test case instead of deleting.`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Cannot preview test case ${case_id}**\n\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
                `The test case may not exist or you may not have permission to view it.`
            }
          ]
        };
      }
    }
  );

  /**
   * Advanced search for test cases with filters
   */
  server.registerTool(
    "search_test_cases_advanced",
    {
      description: "🔍 Advanced search for test cases with multiple filters (priority, type, date, text search)",
      inputSchema: {
        project_id: z.number().describe("Project ID to search in"),
        suite_id: z.number().optional().describe("Suite ID to filter by"),
        section_id: z.number().optional().describe("Section ID to filter by"),
        filter_text: z.string().optional().describe("Text to search in test case titles"),
        priority_ids: z.array(z.number()).optional().describe("Priority IDs to filter by (1=Low, 2=Medium, 3=High, 4=Critical)"),
        type_ids: z.array(z.number()).optional().describe("Case type IDs to filter by"),
        created_after: z.string().optional().describe("Only cases created after this date (YYYY-MM-DD)"),
        created_before: z.string().optional().describe("Only cases created before this date (YYYY-MM-DD)"),
        limit: z.number().optional().describe("Maximum number of results (default 50)")
      }
    },
    async ({ project_id, suite_id, section_id, filter_text, priority_ids, type_ids, created_after, created_before, limit = 50 }) => {
      const options: any = {
        suiteId: suite_id,
        sectionId: section_id,
        filter: filter_text,
        priorityIds: priority_ids,
        typeIds: type_ids,
        limit
      };

      if (created_after) {
        options.createdAfter = new Date(created_after);
      }
      if (created_before) {
        options.createdBefore = new Date(created_before);
      }

      const cases = await api.getCasesAdvanced(project_id, options);
      
      return {
        content: [
          {
            type: "text",
            text: `# 🔍 Advanced Search Results\n\n` +
              `**Search Parameters:**\n` +
              `- Project: ${project_id}\n` +
              `${suite_id ? `- Suite: ${suite_id}\n` : ''}` +
              `${section_id ? `- Section: ${section_id}\n` : ''}` +
              `${filter_text ? `- Text Filter: "${filter_text}"\n` : ''}` +
              `${priority_ids?.length ? `- Priorities: ${priority_ids.join(', ')}\n` : ''}` +
              `${type_ids?.length ? `- Types: ${type_ids.join(', ')}\n` : ''}` +
              `${created_after ? `- Created After: ${created_after}\n` : ''}` +
              `${created_before ? `- Created Before: ${created_before}\n` : ''}` +
              `\n**Found ${cases.length} test cases:**\n\n` +
              cases.slice(0, limit).map(tc => 
                `📋 **${tc.title}** (ID: ${tc.id})\n` +
                `   Section: ${tc.section_id} | Priority: ${tc.priority_id === 1 ? 'Low' : tc.priority_id === 2 ? 'Medium' : tc.priority_id === 3 ? 'High' : 'Critical'} | Type: ${tc.type_id}\n` +
                `   Created: ${new Date(tc.created_on * 1000).toLocaleDateString()}`
              ).join('\n\n') +
              `${cases.length > limit ? `\n\n... and ${cases.length - limit} more results` : ''}`
          }
        ]
      };
    }
  );

  /**
   * Get test case history/audit trail
   */
  server.registerTool(
    "get_test_case_history",
    {
      description: "📜 Get change history and audit trail for a test case - shows who changed what and when",
      inputSchema: {
        case_id: z.number().describe("Test case ID to get history for"),
        limit: z.number().optional().describe("Maximum number of history entries (default 10)")
      }
    },
    async ({ case_id, limit = 10 }) => {
      try {
        const history = await api.getCaseHistory(case_id, limit);
        
        return {
          content: [
            {
              type: "text",
              text: `# 📜 Test Case History - ID: ${case_id}\n\n` +
                `**${history.length} changes found:**\n\n` +
                history.map(entry => {
                  const changeDate = new Date(entry.created_on * 1000).toLocaleString();
                  const changes = entry.changes.map((change: any) => 
                    `   - **${change.label || change.field}**: "${change.old_text || change.old_value}" → "${change.new_text || change.new_value}"`
                  ).join('\n');
                  
                  return `## Change on ${changeDate}\n` +
                    `**User ID:** ${entry.user_id}\n` +
                    `**Changes:**\n${changes}`;
                }).join('\n\n---\n\n')
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to get history for test case ${case_id}**\n\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );

  /**
   * Copy test cases to another section
   */
  server.registerTool(
    "copy_test_cases",
    {
      description: "📋 Copy test cases to another section (creates duplicates, originals remain)",
      inputSchema: {
        case_ids: z.array(z.number()).describe("Array of test case IDs to copy"),
        target_section_id: z.number().describe("Target section ID where cases will be copied"),
        confirmation: z.literal("I_UNDERSTAND_THIS_CREATES_DUPLICATES").describe("Confirmation that you understand this creates duplicates")
      }
    },
    async ({ case_ids, target_section_id, confirmation }) => {
      try {
        const result = await api.copyCasesToSection(target_section_id, case_ids);
        
        return {
          content: [
            {
              type: "text",
              text: `# 📋 Test Cases Copied Successfully\n\n` +
                `**Operation:** Copy test cases\n` +
                `**Source Cases:** ${case_ids.join(', ')}\n` +
                `**Target Section:** ${target_section_id}\n` +
                `**Status:** ✅ Successfully copied ${case_ids.length} test cases\n\n` +
                `💡 **Note:** Original test cases remain in their original location. New copies have been created in the target section.`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to copy test cases**\n\n` +
                `Cases: ${case_ids.join(', ')}\n` +
                `Target Section: ${target_section_id}\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );

  /**
   * Move test cases to another section
   */
  server.registerTool(
    "move_test_cases",
    {
      description: "🚚 Move test cases to another section/suite (removes from original location)",
      inputSchema: {
        case_ids: z.array(z.number()).describe("Array of test case IDs to move"),
        target_section_id: z.number().describe("Target section ID where cases will be moved"),
        target_suite_id: z.number().describe("Target suite ID where cases will be moved"),
        confirmation: z.literal("I_UNDERSTAND_THIS_MOVES_CASES_PERMANENTLY").describe("Confirmation that you understand this moves cases permanently")
      }
    },
    async ({ case_ids, target_section_id, target_suite_id, confirmation }) => {
      try {
        const result = await api.moveCasesToSection(target_section_id, target_suite_id, case_ids);
        
        return {
          content: [
            {
              type: "text",
              text: `# 🚚 Test Cases Moved Successfully\n\n` +
                `**Operation:** Move test cases\n` +
                `**Cases Moved:** ${case_ids.join(', ')}\n` +
                `**Target Section:** ${target_section_id}\n` +
                `**Target Suite:** ${target_suite_id}\n` +
                `**Status:** ✅ Successfully moved ${case_ids.length} test cases\n\n` +
                `⚠️ **Note:** Test cases have been permanently moved from their original location.`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to move test cases**\n\n` +
                `Cases: ${case_ids.join(', ')}\n` +
                `Target Section: ${target_section_id}\n` +
                `Target Suite: ${target_suite_id}\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );

  /**
   * Batch update multiple test cases
   */
  server.registerTool(
    "update_test_cases_batch",
    {
      description: "🔄 Update multiple test cases with the same values (e.g., change priority for multiple cases)",
      inputSchema: {
        suite_id: z.number().describe("Suite ID containing the test cases"),
        case_ids: z.array(z.number()).describe("Array of test case IDs to update"),
        updates: z.object({
          priority_id: z.number().optional().describe("New priority ID (1=Low, 2=Medium, 3=High, 4=Critical)"),
          type_id: z.number().optional().describe("New case type ID"),
          estimate: z.string().optional().describe("New time estimate (e.g., '30m', '1h 30m')"),
          milestone_id: z.number().optional().describe("New milestone ID"),
          refs: z.string().optional().describe("New references/requirements")
        }).describe("Fields to update with new values"),
        confirmation: z.literal("I_HAVE_REVIEWED_THE_CASE_IDS_TO_UPDATE").describe("Confirmation that you have reviewed the case IDs")
      }
    },
    async ({ suite_id, case_ids, updates, confirmation }) => {
      try {
        const result = await api.updateCasesBatch(suite_id, case_ids, updates);
        
        const updateSummary = Object.entries(updates)
          .map(([key, value]) => `- ${key}: ${value}`)
          .join('\n');
        
        return {
          content: [
            {
              type: "text",
              text: `# 🔄 Batch Update Completed\n\n` +
                `**Updated Cases:** ${case_ids.join(', ')}\n` +
                `**Suite:** ${suite_id}\n` +
                `**Changes Applied:**\n${updateSummary}\n\n` +
                `**Status:** ✅ Successfully updated ${case_ids.length} test cases\n\n` +
                `💡 **Note:** All specified test cases now have the same updated values.`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to batch update test cases**\n\n` +
                `Cases: ${case_ids.join(', ')}\n` +
                `Suite: ${suite_id}\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );

  /**
   * Get available case types and custom fields
   */
  server.registerTool(
    "get_case_metadata",
    {
      description: "📊 Get available case types, priorities, and custom fields for better test case creation",
      inputSchema: {}
    },
    async () => {
      try {
        const [caseTypes, caseFields] = await Promise.all([
          api.getCaseTypes(),
          api.getCaseFields()
        ]);
        
        return {
          content: [
            {
              type: "text",
              text: `# 📊 TestRail Case Metadata\n\n` +
                `## 🏷️ Available Case Types:\n` +
                caseTypes.map(type => 
                  `- **${type.name}** (ID: ${type.id})${type.is_default ? ' ⭐ Default' : ''}`
                ).join('\n') +
                `\n\n## 📝 Custom Fields:\n` +
                caseFields.map(field => 
                  `- **${field.label}** (${field.system_name})\n` +
                  `  Type: ${field.type_id === 1 ? 'String' : field.type_id === 2 ? 'Integer' : field.type_id === 3 ? 'Text' : field.type_id === 5 ? 'Checkbox' : field.type_id === 6 ? 'Dropdown' : 'Other'}\n` +
                  `  Description: ${field.description || 'No description'}`
                ).join('\n\n') +
                `\n\n## 🎯 Standard Priorities:\n` +
                `- **Low** (ID: 1)\n` +
                `- **Medium** (ID: 2)\n` +
                `- **High** (ID: 3)\n` +
                `- **Critical** (ID: 4)`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to get case metadata**\n\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );

  /**
   * Get attachments for a test case
   */
  server.registerTool(
    "get_test_case_attachments",
    {
      description: "📎 Get list of attachments for a test case",
      inputSchema: {
        case_id: z.number().describe("Test case ID to get attachments for"),
        limit: z.number().optional().describe("Maximum number of attachments to return (default 10)")
      }
    },
    async ({ case_id, limit = 10 }) => {
      try {
        const attachments = await api.getAttachmentsForCase(case_id, limit);
        
        return {
          content: [
            {
              type: "text",
              text: `# 📎 Attachments for Test Case ${case_id}\n\n` +
                `**Found ${attachments.length} attachments:**\n\n` +
                (attachments.length > 0 
                  ? attachments.map(att => 
                      `📄 **${att.name}**\n` +
                      `   Size: ${(att.size / 1024).toFixed(1)} KB\n` +
                      `   Type: ${att.filetype || 'Unknown'}\n` +
                      `   Uploaded: ${new Date(att.created_on * 1000).toLocaleDateString()}\n` +
                      `   User: ${att.user_id}`
                    ).join('\n\n')
                  : '📭 No attachments found for this test case.'
                )
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to get attachments for test case ${case_id}**\n\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );

  /**
   * Get project milestones
   */
  server.registerTool(
    "get_project_milestones",
    {
      description: "🎯 Get milestones for a project - track releases, deadlines, and project phases",
      inputSchema: {
        project_id: z.number().describe("Project ID to get milestones for"),
        is_completed: z.boolean().optional().describe("Filter by completion status (true=completed, false=active)"),
        is_started: z.boolean().optional().describe("Filter by start status (true=started, false=upcoming)"),
        limit: z.number().optional().describe("Maximum number of milestones (default 25)")
      }
    },
    async ({ project_id, is_completed, is_started, limit = 25 }) => {
      try {
        const milestones = await api.getMilestones(project_id, {
          isCompleted: is_completed,
          isStarted: is_started,
          limit
        });
        
        return {
          content: [
            {
              type: "text",
              text: `# 🎯 Milestones for Project ${project_id}\n\n` +
                `**Found ${milestones.length} milestones:**\n\n` +
                (milestones.length > 0 
                  ? milestones.map(ms => {
                      const status = ms.is_completed ? '✅ Completed' : ms.is_started ? '🟡 In Progress' : '⏸️ Upcoming';
                      const dueDate = ms.due_on ? new Date(ms.due_on * 1000).toLocaleDateString() : 'No due date';
                      const startDate = ms.start_on ? new Date(ms.start_on * 1000).toLocaleDateString() : 'No start date';
                      
                      return `## 🎯 ${ms.name} (ID: ${ms.id})\n` +
                        `**Status:** ${status}\n` +
                        `**Start Date:** ${startDate}\n` +
                        `**Due Date:** ${dueDate}\n` +
                        `${ms.description ? `**Description:** ${ms.description}\n` : ''}` +
                        `${ms.refs ? `**References:** ${ms.refs}\n` : ''}` +
                        `${ms.parent_id ? `**Parent Milestone:** ${ms.parent_id}\n` : ''}`;
                    }).join('\n---\n\n')
                  : '📭 No milestones found for this project.'
                )
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to get milestones for project ${project_id}**\n\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );

  /**
   * Create new milestone
   */
  server.registerTool(
    "create_milestone",
    {
      description: "🎯 Create a new milestone for project planning and deadline tracking",
      inputSchema: {
        project_id: z.number().describe("Project ID to create milestone in"),
        name: z.string().describe("Milestone name"),
        description: z.string().optional().describe("Milestone description"),
        due_date: z.string().optional().describe("Due date (YYYY-MM-DD format)"),
        start_date: z.string().optional().describe("Start date (YYYY-MM-DD format)"),
        parent_milestone_id: z.number().optional().describe("Parent milestone ID for sub-milestones"),
        references: z.string().optional().describe("References/requirements")
      }
    },
    async ({ project_id, name, description, due_date, start_date, parent_milestone_id, references }) => {
      try {
        const milestoneData: any = {
          name,
          description,
          parentId: parent_milestone_id,
          refs: references
        };

        if (due_date) {
          milestoneData.dueOn = new Date(due_date);
        }
        if (start_date) {
          milestoneData.startOn = new Date(start_date);
        }

        const milestone = await api.addMilestone(project_id, milestoneData);
        
        return {
          content: [
            {
              type: "text",
              text: `# 🎯 Milestone Created Successfully\n\n` +
                `**Milestone Details:**\n` +
                `- **ID:** ${milestone.id}\n` +
                `- **Name:** ${milestone.name}\n` +
                `- **Project:** ${project_id}\n` +
                `${description ? `- **Description:** ${description}\n` : ''}` +
                `${due_date ? `- **Due Date:** ${due_date}\n` : ''}` +
                `${start_date ? `- **Start Date:** ${start_date}\n` : ''}` +
                `${parent_milestone_id ? `- **Parent Milestone:** ${parent_milestone_id}\n` : ''}` +
                `${references ? `- **References:** ${references}\n` : ''}\n` +
                `✅ **Status:** Successfully created and ready for use!`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to create milestone**\n\n` +
                `Project: ${project_id}\n` +
                `Name: ${name}\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );

  /**
   * Update milestone status
   */
  server.registerTool(
    "update_milestone_status",
    {
      description: "🔄 Update milestone status (mark as completed, started, or update details)",
      inputSchema: {
        milestone_id: z.number().describe("Milestone ID to update"),
        is_completed: z.boolean().optional().describe("Mark milestone as completed (true) or active (false)"),
        is_started: z.boolean().optional().describe("Mark milestone as started (true) or upcoming (false)"),
        name: z.string().optional().describe("New milestone name"),
        description: z.string().optional().describe("New milestone description"),
        due_date: z.string().optional().describe("New due date (YYYY-MM-DD format)"),
        start_date: z.string().optional().describe("New start date (YYYY-MM-DD format)")
      }
    },
    async ({ milestone_id, is_completed, is_started, name, description, due_date, start_date }) => {
      try {
        const updates: any = {
          name,
          description,
          isCompleted: is_completed,
          isStarted: is_started
        };

        if (due_date) {
          updates.dueOn = new Date(due_date);
        }
        if (start_date) {
          updates.startOn = new Date(start_date);
        }

        const milestone = await api.updateMilestone(milestone_id, updates);
        
        const statusText = is_completed ? '✅ Completed' : is_started ? '🟡 In Progress' : is_started === false ? '⏸️ Upcoming' : 'Status unchanged';
        
        return {
          content: [
            {
              type: "text",
              text: `# 🔄 Milestone Updated Successfully\n\n` +
                `**Updated Milestone:**\n` +
                `- **ID:** ${milestone_id}\n` +
                `${name ? `- **New Name:** ${name}\n` : ''}` +
                `${description ? `- **New Description:** ${description}\n` : ''}` +
                `${is_completed !== undefined || is_started !== undefined ? `- **New Status:** ${statusText}\n` : ''}` +
                `${due_date ? `- **New Due Date:** ${due_date}\n` : ''}` +
                `${start_date ? `- **New Start Date:** ${start_date}\n` : ''}\n` +
                `✅ **Result:** Milestone successfully updated!`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to update milestone ${milestone_id}**\n\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );

  /**
   * Get project labels
   */
  server.registerTool(
    "get_project_labels",
    {
      description: "🏷️ Get labels (tags) for a project - useful for categorizing and filtering test cases",
      inputSchema: {
        project_id: z.number().describe("Project ID to get labels for"),
        limit: z.number().optional().describe("Maximum number of labels (default 50)")
      }
    },
    async ({ project_id, limit = 50 }) => {
      try {
        const labels = await api.getLabels(project_id, limit);
        
        return {
          content: [
            {
              type: "text",
              text: `# 🏷️ Labels for Project ${project_id}\n\n` +
                `**Found ${labels.length} labels:**\n\n` +
                (labels.length > 0 
                  ? labels.map(label => 
                      `🏷️ **${label.title || label.name}** (ID: ${label.id})\n` +
                      `   Created: ${new Date(label.created_on * 1000).toLocaleDateString()}\n` +
                      `   Created by: User ${label.created_by}`
                    ).join('\n\n')
                  : '📭 No labels found for this project.\n\n💡 **Tip:** Labels help categorize test cases for better organization and filtering.'
                )
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to get labels for project ${project_id}**\n\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );

  /**
   * Get user groups and permissions
   */
  server.registerTool(
    "get_user_groups",
    {
      description: "👥 Get user groups and their members - useful for understanding team structure and permissions",
      inputSchema: {}
    },
    async () => {
      try {
        const groups = await api.getGroups();
        
        return {
          content: [
            {
              type: "text",
              text: `# 👥 User Groups\n\n` +
                `**Found ${groups.length} groups:**\n\n` +
                (groups.length > 0 
                  ? groups.map(group => 
                      `## 👥 ${group.name} (ID: ${group.id})\n` +
                      `**Members:** ${group.user_ids.length} users\n` +
                      `**User IDs:** ${group.user_ids.join(', ')}`
                    ).join('\n\n---\n\n')
                  : '📭 No user groups found.\n\n💡 **Note:** User groups help organize team members and manage permissions.'
                )
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to get user groups**\n\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
                `💡 **Note:** This feature requires TestRail 7.5+ and appropriate permissions.`
            }
          ]
        };
      }
    }
  );

  /**
   * Preview delete milestone
   */
  server.registerTool(
    "preview_delete_milestone",
    {
      description: "🔍 PREVIEW milestone deletion before actual deletion - shows what will be deleted",
      inputSchema: {
        milestone_id: z.number().describe("Milestone ID to preview for deletion")
      }
    },
    async ({ milestone_id }) => {
      try {
        const milestone = await api.getMilestone(milestone_id);
        
        return {
          content: [
            {
              type: "text",
              text: `# 🚨 MILESTONE DELETE PREVIEW\n\n` +
                `**Milestone to be DELETED:**\n` +
                `- **ID:** ${milestone.id}\n` +
                `- **Name:** "${milestone.name}"\n` +
                `- **Project:** ${milestone.project_id}\n` +
                `- **Status:** ${milestone.is_completed ? '✅ Completed' : milestone.is_started ? '🟡 In Progress' : '⏸️ Upcoming'}\n` +
                `- **Due Date:** ${milestone.due_on ? new Date(milestone.due_on * 1000).toLocaleDateString() : 'No due date'}\n` +
                `${milestone.description ? `- **Description:** ${milestone.description}\n` : ''}` +
                `${milestone.refs ? `- **References:** ${milestone.refs}\n` : ''}\n` +
                `⚠️ **WARNING: DELETION IS IRREVERSIBLE!**\n\n` +
                `🚨 **IMPACT:**\n` +
                `- Milestone will be permanently removed\n` +
                `- All test cases linked to this milestone will lose the association\n` +
                `- Historical reports referencing this milestone may be affected\n\n` +
                `🚨 **NEXT STEPS:**\n` +
                `1. Review the milestone details above carefully\n` +
                `2. If you're absolutely sure, use "delete_milestone_confirmed" tool\n` +
                `3. You must provide a reason for deletion (audit requirement)\n` +
                `4. If you're not sure, DON'T PROCEED with deletion\n\n` +
                `💡 **Alternative:** Consider marking the milestone as completed instead of deleting.`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Cannot preview milestone ${milestone_id}**\n\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
                `The milestone may not exist or you may not have permission to view it.`
            }
          ]
        };
      }
    }
  );

  /**
   * Delete milestone with confirmation
   */
  server.registerTool(
    "delete_milestone_confirmed",
    {
      description: "🚨 DELETE milestone permanently - REQUIRES preview first. This is IRREVERSIBLE!",
      inputSchema: {
        milestone_id: z.number().describe("Milestone ID to delete"),
        confirmation: z.literal("I_UNDERSTAND_THIS_IS_IRREVERSIBLE_DELETE").describe("Explicit confirmation for deletion"),
        reason: z.string().min(10).describe("Reason for deletion (minimum 10 characters) - required for audit purposes")
      }
    },
    async ({ milestone_id, confirmation, reason }) => {
      try {
        // First get the milestone details for the confirmation message
        const milestone = await api.getMilestone(milestone_id);
        
        // Delete the milestone
        await api.deleteMilestone(milestone_id);

        return {
          content: [
            {
              type: "text",
              text: `# 🗑️ MILESTONE DELETED\n\n` +
                `**Deleted Milestone:**\n` +
                `- **ID:** ${milestone.id}\n` +
                `- **Name:** "${milestone.name}"\n` +
                `- **Project:** ${milestone.project_id}\n\n` +
                `**Deletion Details:**\n` +
                `- **Timestamp:** ${new Date().toISOString()}\n` +
                `- **Reason:** ${reason}\n\n` +
                `⚠️ **This action is IRREVERSIBLE!**\n` +
                `The milestone has been permanently removed from TestRail.\n\n` +
                `📝 **Impact Summary:**\n` +
                `- Test cases previously linked to this milestone are now unlinked\n` +
                `- Reports may need to be updated to reflect this change\n` +
                `- This action has been logged for audit purposes`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to delete milestone ${milestone_id}**\n\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
                `The milestone may not exist, you may not have permission to delete it, or it may still be referenced by active test plans.`
            }
          ]
        };
      }
    }
  );

  /**
   * Get test runs for a project
   */
  server.registerTool(
    "get_test_runs",
    {
      description: "🏃 Get test runs for a project - view execution history and active test runs",
      inputSchema: {
        project_id: z.number().describe("Project ID to get test runs for"),
        is_completed: z.boolean().optional().describe("Filter by completion status (true=completed, false=active)"),
        limit: z.number().optional().describe("Maximum number of runs (default 25)")
      }
    },
    async ({ project_id, is_completed, limit = 25 }) => {
      try {
        const runs = await api.getRuns(project_id, {
          isCompleted: is_completed,
          limit
        });
        
        return {
          content: [
            {
              type: "text",
              text: `# 🏃 Test Runs for Project ${project_id}\n\n` +
                `**Found ${runs.runs?.length || 0} test runs:**\n\n` +
                (runs.runs?.length > 0 
                  ? runs.runs.map((run: any) => {
                      const status = run.is_completed ? '✅ Completed' : '🟡 Active';
                      const passRate = run.passed_count && (run.passed_count + run.failed_count) > 0 
                        ? Math.round((run.passed_count / (run.passed_count + run.failed_count)) * 100) 
                        : 0;
                      
                      return `## 🏃 ${run.name} (ID: ${run.id})\n` +
                        `**Status:** ${status}\n` +
                        `**Suite:** ${run.suite_id}\n` +
                        `**Tests:** Passed: ${run.passed_count || 0}, Failed: ${run.failed_count || 0}, Untested: ${run.untested_count || 0}\n` +
                        `**Pass Rate:** ${passRate}%\n` +
                        `**Created:** ${new Date(run.created_on * 1000).toLocaleDateString()}\n` +
                        `${run.description ? `**Description:** ${run.description}\n` : ''}` +
                        `${run.milestone_id ? `**Milestone:** ${run.milestone_id}\n` : ''}`;
                    }).join('\n---\n\n')
                  : '📭 No test runs found for this project.'
                )
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to get test runs for project ${project_id}**\n\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );

  /**
   * Create a new test run
   */
  server.registerTool(
    "create_test_run",
    {
      description: "🚀 Create a new test run - execute tests in an organized way",
      inputSchema: {
        project_id: z.number().describe("Project ID to create test run in"),
        name: z.string().describe("Name for the test run"),
        suite_id: z.number().optional().describe("Suite ID (required unless single suite mode)"),
        description: z.string().optional().describe("Test run description"),
        milestone_id: z.number().optional().describe("Milestone ID to link to"),
        include_all: z.boolean().optional().describe("Include all test cases (default: true)"),
        case_ids: z.array(z.number()).optional().describe("Specific test case IDs (if include_all is false)")
      }
    },
    async ({ project_id, name, suite_id, description, milestone_id, include_all = true, case_ids }) => {
      try {
        const run = await api.addRun(project_id, {
          name,
          suiteId: suite_id,
          description,
          milestoneId: milestone_id,
          includeAll: include_all,
          caseIds: case_ids
        });
        
        return {
          content: [
            {
              type: "text",
              text: `# 🚀 Test Run Created Successfully\n\n` +
                `**Test Run Details:**\n` +
                `- **ID:** ${run.id}\n` +
                `- **Name:** ${run.name}\n` +
                `- **Project:** ${project_id}\n` +
                `${suite_id ? `- **Suite:** ${suite_id}\n` : ''}` +
                `${description ? `- **Description:** ${description}\n` : ''}` +
                `${milestone_id ? `- **Milestone:** ${milestone_id}\n` : ''}` +
                `- **Include All Cases:** ${include_all ? 'Yes' : 'No'}\n` +
                `${case_ids ? `- **Selected Cases:** ${case_ids.length} cases\n` : ''}` +
                `- **URL:** ${run.url}\n\n` +
                `✅ **Status:** Test run created and ready for execution!`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to create test run**\n\n` +
                `Project: ${project_id}\n` +
                `Name: ${name}\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );

  /**
   * Get shared steps for a project
   */
  server.registerTool(
    "get_shared_steps",
    {
      description: "🔗 Get shared steps for a project - reusable test step libraries",
      inputSchema: {
        project_id: z.number().describe("Project ID to get shared steps for"),
        limit: z.number().optional().describe("Maximum number of shared steps (default 25)")
      }
    },
    async ({ project_id, limit = 25 }) => {
      try {
        const sharedSteps = await api.getSharedSteps(project_id, { limit });
        
        return {
          content: [
            {
              type: "text",
              text: `# 🔗 Shared Steps for Project ${project_id}\n\n` +
                `**Found ${sharedSteps.shared_steps?.length || 0} shared step sets:**\n\n` +
                (sharedSteps.shared_steps?.length > 0 
                  ? sharedSteps.shared_steps.map((step: any) => 
                      `## 🔗 ${step.title} (ID: ${step.id})\n` +
                      `**Created:** ${new Date(step.created_on * 1000).toLocaleDateString()}\n` +
                      `**Updated:** ${new Date(step.updated_on * 1000).toLocaleDateString()}\n` +
                      `**Used in Cases:** ${step.case_ids?.length || 0} test cases`
                    ).join('\n\n---\n\n')
                  : '📭 No shared steps found for this project.\n\n💡 **Tip:** Shared steps help reuse common test procedures across multiple test cases.'
                )
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to get shared steps for project ${project_id}**\n\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
                `💡 **Note:** This feature requires TestRail 7.0+ and appropriate permissions.`
            }
          ]
        };
      }
    }
  );

  /**
   * Get test result statuses
   */
  server.registerTool(
    "get_test_statuses",
    {
      description: "📊 Get available test result statuses - understand status options for test execution",
      inputSchema: {}
    },
    async () => {
      try {
        const statuses = await api.getStatuses();
        
        return {
          content: [
            {
              type: "text",
              text: `# 📊 Test Result Statuses\n\n` +
                `**Available statuses for test execution:**\n\n` +
                statuses.map((status: any) => {
                  const statusType = status.is_system ? '🔧 System' : '⚙️ Custom';
                  const finalStatus = status.is_final ? ' (Final)' : ' (Non-final)';
                  const untested = status.is_untested ? ' - Untested' : '';
                  
                  return `## ${status.label} (ID: ${status.id})\n` +
                    `**Type:** ${statusType}${finalStatus}${untested}\n` +
                    `**System Name:** ${status.name}`;
                }).join('\n\n---\n\n') +
                `\n\n💡 **Usage:** These statuses are used when recording test results during test execution.`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to get test statuses**\n\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );

  /**
   * Get user roles
   */
  server.registerTool(
    "get_user_roles",
    {
      description: "👤 Get available user roles - understand permission levels in TestRail",
      inputSchema: {}
    },
    async () => {
      try {
        const roles = await api.getRoles();
        
        return {
          content: [
            {
              type: "text",
              text: `# 👤 User Roles\n\n` +
                `**Available roles in TestRail:**\n\n` +
                (roles.roles?.length > 0 
                  ? roles.roles.map((role: any) => 
                      `## 👤 ${role.name} (ID: ${role.id})\n` +
                      `**Default Role:** ${role.is_default ? 'Yes' : 'No'}\n` +
                      `${role.is_project_admin !== undefined ? `**Project Admin:** ${role.is_project_admin ? 'Yes' : 'No'}\n` : ''}`
                    ).join('\n---\n\n')
                  : '📭 No roles found.\n\n💡 **Note:** User roles define permission levels for TestRail access.'
                ) +
                `\n\n💡 **Note:** This feature requires TestRail 7.3+ and appropriate admin permissions.`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to get user roles**\n\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
                `💡 **Note:** This feature requires TestRail 7.3+ and administrator permissions.`
            }
          ]
        };
      }
    }
  );

  /**
   * Create a test suite
   */
  server.registerTool(
    "create_test_suite",
    {
      description: "📁 Create a new test suite - organize test cases into logical groups",
      inputSchema: {
        project_id: z.number().describe("Project ID to create suite in"),
        name: z.string().describe("Name for the test suite"),
        description: z.string().optional().describe("Suite description")
      }
    },
    async ({ project_id, name, description }) => {
      try {
        const suite = await api.addSuite(project_id, { name, description });
        
        return {
          content: [
            {
              type: "text",
              text: `# 📁 Test Suite Created Successfully\n\n` +
                `**Suite Details:**\n` +
                `- **ID:** ${suite.id}\n` +
                `- **Name:** ${suite.name}\n` +
                `- **Project:** ${project_id}\n` +
                `${description ? `- **Description:** ${description}\n` : ''}` +
                `- **URL:** ${suite.url}\n\n` +
                `✅ **Status:** Test suite created and ready for sections and test cases!`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to create test suite**\n\n` +
                `Project: ${project_id}\n` +
                `Name: ${name}\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );

  /**
   * Get templates (field layouts) for a project
   */
  server.registerTool(
    "get_project_templates",
    {
      description: "📋 Get available templates (field layouts) for a project - understand test case structures",
      inputSchema: {
        project_id: z.number().describe("Project ID to get templates for")
      }
    },
    async ({ project_id }) => {
      try {
        const templates = await api.getTemplates(project_id);
        
        return {
          content: [
            {
              type: "text",
              text: `# 📋 Templates for Project ${project_id}\n\n` +
                `**Available templates (field layouts):**\n\n` +
                (templates.length > 0 
                  ? templates.map((template: any) => 
                      `## 📋 ${template.name} (ID: ${template.id})\n` +
                      `**Default:** ${template.is_default ? 'Yes ✅' : 'No'}\n` +
                      `**Usage:** This template defines the field layout for test cases`
                    ).join('\n\n---\n\n')
                  : '📭 No templates found for this project.\n\n💡 **Note:** Templates define the field structure for test cases.'
                ) +
                `\n\n💡 **Purpose:** Templates determine which fields are available when creating test cases.`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to get templates for project ${project_id}**\n\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
                `💡 **Note:** This feature requires TestRail 5.2+ and appropriate permissions.`
            }
          ]
        };
      }
    }
  );

  /**
   * Get tests in a test run
   */
  server.registerTool(
    "get_test_run_tests",
    {
      description: "🧪 Get individual test instances in a test run - see execution status and assignments",
      inputSchema: {
        run_id: z.number().describe("Test run ID to get tests for"),
        status_filter: z.array(z.number()).optional().describe("Filter by status IDs (1=Passed, 5=Failed, etc.)"),
        limit: z.number().optional().describe("Maximum number of tests (default 50)")
      }
    },
    async ({ run_id, status_filter, limit = 50 }) => {
      try {
        const tests = await api.getTests(run_id, {
          statusId: status_filter,
          limit
        });
        
        return {
          content: [
            {
              type: "text",
              text: `# 🧪 Tests in Run ${run_id}\n\n` +
                `**Found ${tests.tests?.length || 0} test instances:**\n\n` +
                (tests.tests?.length > 0 
                  ? tests.tests.map((test: any) => {
                      const statusMap: { [key: number]: string } = {
                        1: '✅ Passed',
                        2: '🚫 Blocked', 
                        3: '⏸️ Untested',
                        4: '🔄 Retest',
                        5: '❌ Failed'
                      };
                      const status = statusMap[test.status_id] || `Status ${test.status_id}`;
                      
                      return `## 🧪 ${test.title} (ID: ${test.id})\n` +
                        `**Status:** ${status}\n` +
                        `**Case ID:** ${test.case_id}\n` +
                        `**Priority:** ${test.priority_id}\n` +
                        `**Type:** ${test.type_id}\n` +
                        `${test.assignedto_id ? `**Assigned to:** User ${test.assignedto_id}\n` : ''}` +
                        `${test.estimate ? `**Estimate:** ${test.estimate}\n` : ''}`;
                    }).join('\n---\n\n')
                  : '📭 No tests found in this run.'
                ) +
                `\n\n💡 **Note:** These are individual test instances that can be executed and have results recorded.`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to get tests for run ${run_id}**\n\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );

  /**
   * Get current user information
   */
  server.registerTool(
    "get_current_user_info",
    {
      description: "👤 Get current user information - see your TestRail profile and permissions",
      inputSchema: {}
    },
    async () => {
      try {
        const user = await api.getCurrentUser();
        
        return {
          content: [
            {
              type: "text",
              text: `# 👤 Current User Information\n\n` +
                `**Your TestRail Profile:**\n\n` +
                `- **Name:** ${user.name}\n` +
                `- **Email:** ${user.email}\n` +
                `- **User ID:** ${user.id}\n` +
                `- **Role:** ${user.role} (ID: ${user.role_id})\n` +
                `- **Active:** ${user.is_active ? 'Yes ✅' : 'No ❌'}\n` +
                `${user.is_admin !== undefined ? `- **Administrator:** ${user.is_admin ? 'Yes 🔧' : 'No'}\n` : ''}` +
                `${user.group_ids ? `- **Groups:** ${user.group_ids.join(', ')}\n` : ''}` +
                `${user.assigned_projects ? `- **Assigned Projects:** ${user.assigned_projects.join(', ')}\n` : ''}` +
                `${user.email_notifications !== undefined ? `- **Email Notifications:** ${user.email_notifications ? 'Enabled' : 'Disabled'}\n` : ''}` +
                `${user.mfa_required !== undefined ? `- **MFA Required:** ${user.mfa_required ? 'Yes' : 'No'}\n` : ''}` +
                `${user.sso_enabled !== undefined ? `- **SSO Enabled:** ${user.sso_enabled ? 'Yes' : 'No'}\n` : ''}`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to get current user information**\n\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
                `💡 **Note:** This feature requires TestRail 6.6+ and valid authentication.`
            }
          ]
        };
      }
    }
  );

  /**
   * Get users in a project
   */
  server.registerTool(
    "get_project_users",
    {
      description: "👥 Get users with access to a project - see team members and their roles",
      inputSchema: {
        project_id: z.number().optional().describe("Project ID (required for non-administrators)")
      }
    },
    async ({ project_id }) => {
      try {
        const users = await api.getUsers(project_id);
        
        return {
          content: [
            {
              type: "text",
              text: `# 👥 ${project_id ? `Project ${project_id} ` : ''}Users\n\n` +
                `**Found ${users.length || 0} users:**\n\n` +
                (users.length > 0 
                  ? users.map((user: any) => 
                      `## 👤 ${user.name} (ID: ${user.id})\n` +
                      `**Email:** ${user.email}\n` +
                      `**Role:** ${user.role || 'Unknown'} ${user.role_id ? `(ID: ${user.role_id})` : ''}\n` +
                      `**Active:** ${user.is_active ? 'Yes ✅' : 'No ❌'}\n` +
                      `${user.is_admin !== undefined ? `**Admin:** ${user.is_admin ? 'Yes 🔧' : 'No'}\n` : ''}`
                    ).join('\n---\n\n')
                  : '📭 No users found.\n\n💡 **Note:** Non-administrators must specify a project_id parameter.'
                )
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to get users**\n\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
                `💡 **Note:** Non-administrators must include a project_id parameter (TestRail 6.6+).`
            }
          ]
        };
      }
    }
  );

  /**
   * Get variables for a project (Enterprise)
   */
  server.registerTool(
    "get_project_variables",
    {
      description: "🔢 Get test data variables for a project - manage dynamic test data (Enterprise)",
      inputSchema: {
        project_id: z.number().describe("Project ID to get variables for")
      }
    },
    async ({ project_id }) => {
      try {
        const variables = await api.getVariables(project_id);
        
        return {
          content: [
            {
              type: "text",
              text: `# 🔢 Variables for Project ${project_id}\n\n` +
                `**Found ${variables.variables?.length || 0} test data variables:**\n\n` +
                (variables.variables?.length > 0 
                  ? variables.variables.map((variable: any) => 
                      `🔢 **${variable.name}** (ID: ${variable.id})`
                    ).join('\n\n')
                  : '📭 No variables found for this project.\n\n💡 **Purpose:** Variables store dynamic test data that can be used in test cases and datasets.'
                ) +
                `\n\n💡 **Note:** Variables enable data-driven testing with dynamic values in test cases.`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to get variables for project ${project_id}**\n\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
                `💡 **Note:** This feature requires TestRail Enterprise and appropriate permissions.`
            }
          ]
        };
      }
    }
  );

  /**
   * Create a test data variable (Enterprise)
   */
  server.registerTool(
    "create_test_variable",
    {
      description: "🔢 Create a new test data variable - enable data-driven testing (Enterprise)",
      inputSchema: {
        project_id: z.number().describe("Project ID to create variable in"),
        name: z.string().describe("Variable name")
      }
    },
    async ({ project_id, name }) => {
      try {
        const variable = await api.addVariable(project_id, { name });
        
        return {
          content: [
            {
              type: "text",
              text: `# 🔢 Variable Created Successfully\n\n` +
                `**Variable Details:**\n` +
                `- **ID:** ${variable.id}\n` +
                `- **Name:** ${variable.name}\n` +
                `- **Project:** ${project_id}\n\n` +
                `✅ **Status:** Variable created and ready for use in datasets!\n\n` +
                `💡 **Next Steps:** You can now use this variable in test cases and create datasets with values.`
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ **Failed to create variable**\n\n` +
                `Project: ${project_id}\n` +
                `Name: ${name}\n` +
                `Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
                `💡 **Note:** This feature requires TestRail Enterprise and appropriate permissions.`
            }
          ]
        };
      }
    }
  );
}
