# TestRail MCP Server - Modular Structure

This document describes the refactored modular structure of the TestRail MCP Server.

## 📁 File Structure

```
src/
├── index.ts                    # Main server entry point
├── testrail-api.ts            # TestRail API wrapper
├── tools-original.ts          # Original monolithic tools file (backup)
└── tools/
    ├── index.ts               # Main tools coordinator
    ├── project-tools.ts       # Project management tools
    ├── case-tools.ts          # Individual test case creation
    ├── batch-tools.ts         # Batch operations and previews
    ├── search-tools.ts        # Search and metadata tools
    └── admin-tools.ts         # Administrative operations
```

## 🔧 Tool Modules

### Project Tools (`project-tools.ts`)
- `list_projects` - List all accessible TestRail projects
- `get_project` - Get detailed information about a specific project
- `list_sections` - Get all sections in a test suite

### Case Tools (`case-tools.ts`)
- `create_text_test_case` - Create text-based test cases
- `create_steps_test_case` - Create step-based test cases with structured steps
- `create_exploratory_test_case` - Create exploratory test cases
- `create_section` - Create new sections in test suites
- `get_test_case` - Get detailed test case information
- `list_test_cases` - List test cases in a section

### Batch Tools (`batch-tools.ts`)
- `preview_test_cases_batch` - Preview test cases before creation (SAFETY)
- `create_test_cases_batch_confirmed` - Create multiple test cases from previews

### Search Tools (`search-tools.ts`)
- `search_test_cases_advanced` - Advanced search with multiple filters
- `get_test_case_history` - Get audit trail for test cases
- `get_case_metadata` - Get available types, priorities, custom fields
- `get_test_statuses` - Get available test result statuses

### Admin Tools (`admin-tools.ts`)
- `preview_delete_test_case` - Preview deletion before executing (SAFETY)
- `delete_test_case_confirmed` - Delete test cases (IRREVERSIBLE)
- `copy_test_cases` - Copy test cases to another section
- `move_test_cases` - Move test cases to another section
- `update_test_cases_batch` - Bulk update multiple test cases

