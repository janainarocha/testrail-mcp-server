# TestRail MCP Server

A comprehensive Model Context Protocol (MCP) server that enables AI assistants to interact with TestRail for automated test case management and execution. This server provides **complete TestRail REST API v2 coverage** with **93 MCP tools**.

## 🚀 Complete TestRail Integration

- ✅ **93 MCP Tools** - Most comprehensive TestRail integration available
- ✅ **22 API Modules** - Full TestRail REST API v2 coverage
- ✅ **13 Attachment Tools** - Complete file management (upload, download, list, delete)
- ✅ **Advanced Search** - Multi-filter test case discovery
- ✅ **Bulk Operations** - Mass updates and data export
- ✅ **Full CRUD** - Create, Read, Update, Delete for all entities


## 🚀 Two Ways to Use

### Option 1: Quick Setup (Recommended)

Add this to your VS Code `mcp.json` file:

```json
{
  "servers": {
    "testrail": {
      "command": "npx",
      "args": [
        "-y",
        "github:janainarocha/testrail-mcp-server#v1.0.0"
      ],
      "type": "stdio",
      "env": {
        "TESTRAIL_URL": "https://yourcompany.testrail.io",
        "TESTRAIL_USER": "your.email@company.com",
        "TESTRAIL_API_KEY": "your-api-key"
      }
    }
  }
}
```

**That's it!** Restart VS Code and use MCP commands directly.

### Option 2: Local Installation

1. **Clone and install:**
```bash
git clone https://github.com/janainarocha/testrail-mcp-server.git
cd testrail-mcp-server
npm install
npm run build
```

2. **Add to VS Code `mcp.json` with your credentials:**
```json
{
  "servers": {
    "testrail": {
      "command": "node",
      "args": [
        "/path/to/testrail-mcp-server/dist/index.js"
      ],
      "type": "stdio",
      "env": {
        "TESTRAIL_URL": "https://yourcompany.testrail.io",
        "TESTRAIL_USER": "your.email@company.com",
        "TESTRAIL_API_KEY": "your-api-key"
      }
    }
  }
}
```

## 🔧 Setup Instructions

### 1. Get Your TestRail API Key
1. Log in to TestRail
2. Go to **My Account** → **API Keys**
3. Click **Add Key**
4. Copy the generated key

### 2. Configure VS Code
Add to your **global** VS Code MCP configuration file:
- **Windows**: `%APPDATA%\Code\User\mcp.json`
- **Mac**: `~/Library/Application Support/Code/User/mcp.json`
- **Linux**: `~/.config/Code/User/mcp.json`

### 3. Update Configuration
Replace `your.email@company.com` and `your-api-key` with your actual credentials.

### 4. Restart VS Code

## 🛠️ Prerequisites

- **Node.js 18+** (for local installation)
- **VS Code** with **GitHub Copilot** extension
- **TestRail account** with API access
- **TestRail API key** (get from My Settings > API Keys)

## 💬 Usage Examples

### **Get Started: TestRail Context & Capabilities**
```
#testrail_get_capabilities
```
*This command provides complete TestRail platform context, terminology, and all available MCP tools - perfect for AI to understand TestRail concepts and workflows.*

### **Export Test Cases in Bulk**
```
#testrail_bulk_export_cases project_id: 1 suite_id: 5 include_steps: true
```

**List Projects**
```
#testrail_list_projects
```

**Create Test Cases**
```
#testrail_create_test_case
title: "Test successful user authentication"
section_id: 5
custom_expected: "User should be redirected to dashboard"
priority_id: 3
```

**Explore Structure**
```
#testrail_get_project project_id: 1
#testrail_list_sections project_id: 1 suite_id: 2
#testrail_get_case case_id: 456
```

**Create Sections**
```
#testrail_add_section suite_id: 3 name: "API Tests"
```

**Manage Attachments**
```
#testrail_add_attachment_to_case case_id: 123 file_path: "C:\screenshots\test_failure.png"
#testrail_get_attachments_for_case case_id: 123
#testrail_download_attachment attachment_id: 1234
```

## 🔍 Troubleshooting

### Server Not Appearing
- Check VS Code `mcp.json` file location and syntax
- Restart VS Code completely
- Verify GitHub Copilot extension is installed and active


### Commands Not Working
- Ensure you're using GitHub Copilot Chat (not regular terminal)
- Use exact tool names (e.g., `testrail_list_projects`)
- Check VS Code output logs for detailed error messages
- Verify your TestRail permissions for the requested operation

### 👀 **Read Operations (36+ tools)**
| Command | Description | Example |
|---------|-------------|---------|
| `testrail_list_projects` | List all accessible TestRail projects | `#testrail_list_projects` |
| `testrail_get_project` | Get project details with suites | `#testrail_get_project project_id: 5` |
| `testrail_get_suites` | List test suites in a project | `#testrail_get_suites project_id: 3` |
| `testrail_list_sections` | List sections in a suite | `#testrail_list_sections project_id: 1 suite_id: 10` |
| `testrail_get_cases` | List test cases with advanced filtering | `#testrail_get_cases project_id: 1 suite_id: 2` |
| `testrail_get_case` | Get detailed test case information | `#testrail_get_case case_id: 456` |
| `testrail_search_test_cases_advanced` | Advanced search with multiple filters | `#testrail_search_test_cases_advanced project_id: 1 priority_ids: [3]` |
| `testrail_get_milestones` | Get milestones for project planning | `#testrail_get_milestones project_id: 3` |
| `testrail_get_labels` | Get labels for test case organization | `#testrail_get_labels project_id: 5` |
| `testrail_get_runs` | Get test runs for a project | `#testrail_get_runs project_id: 2` |
| `testrail_get_shared_steps` | Get shared steps for reusable procedures | `#testrail_get_shared_steps project_id: 1` |
| `testrail_get_statuses` | Get test result statuses | `#testrail_get_statuses` |
| `testrail_get_case_metadata` | Get available types and custom fields | `#testrail_get_case_metadata` |
| `testrail_get_test_case_history` | Get change history and audit trail | `#testrail_get_test_case_history case_id: 123` |
| `testrail_get_priorities` | Get test case priorities | `#testrail_get_priorities` |
| `testrail_get_templates` | Get available templates for cases | `#testrail_get_templates project_id: 1` |

### ➕ **Create Operations (20+ tools)**
| Command | Description | Example |
|---------|-------------|---------|
| `testrail_add_section` | Create new organizational section | `#testrail_add_section suite_id: 3 name: "API Tests"` |
| `testrail_create_test_case` | Create comprehensive test case | `#testrail_create_test_case title: "Login validation" section_id: 5` |
| `testrail_add_milestone` | Create project milestone for planning | `#testrail_add_milestone project_id: 3 name: "Release 2.0"` |
| `testrail_add_run` | Create new test run for execution | `#testrail_add_run project_id: 2 suite_id: 10 name: "Sprint 5 Testing"` |
| `testrail_add_suite` | Create new test suite for organization | `#testrail_add_suite project_id: 1 name: "API Tests"` |
| `testrail_add_result` | Add test execution result | `#testrail_add_result test_id: 123 status_id: 1` |
| `testrail_add_shared_step` | Create reusable test step | `#testrail_add_shared_step project_id: 1 title: "Login procedure"` |
| `testrail_add_variable` | Create variable for data-driven testing | `#testrail_add_variable project_id: 1 name: "test_user"` |

### � **Update Operations (20+ tools)**
| Command | Description | Example |
|---------|-------------|---------|
| `testrail_update_test_case` | Update existing test case | `#testrail_update_test_case case_id: 456 title: "Updated title"` |
| `testrail_update_test_cases_batch` | Update multiple cases with same values | `#testrail_update_test_cases_batch case_ids: [1,2,3] updates: {...}` |
| `testrail_copy_test_cases` | Copy test cases to another section | `#testrail_copy_test_cases case_ids: [1,2,3] target_section_id: 15` |
| `testrail_move_test_cases` | Move test cases to another section/suite | `#testrail_move_test_cases case_ids: [4,5,6] target_section_id: 20` |
| `testrail_update_milestone` | Update milestone status/details | `#testrail_update_milestone milestone_id: 10 is_completed: true` |
| `testrail_update_run` | Update test run details | `#testrail_update_run run_id: 100 name: "Updated run name"` |
| `testrail_update_section` | Update section details | `#testrail_update_section section_id: 50 name: "Updated section"` |
| `testrail_update_suite` | Update test suite details | `#testrail_update_suite suite_id: 25 name: "Updated suite"` |

### 🗑️ **Delete Operations (11+ tools - Requires Confirmation)**
| Command | Description | Example |
|---------|-------------|---------|
| `testrail_delete_test_case` | Delete test case permanently | `#testrail_delete_test_case case_id: 456 confirmation: "I_UNDERSTAND_THIS_IS_IRREVERSIBLE_DELETE"` |
| `testrail_delete_section` | Delete section permanently | `#testrail_delete_section section_id: 50 confirmation: "I_UNDERSTAND_THIS_IS_IRREVERSIBLE_DELETE"` |
| `testrail_delete_suite` | Delete test suite permanently | `#testrail_delete_suite suite_id: 25 confirmation: "I_UNDERSTAND_THIS_IS_IRREVERSIBLE_DELETE"` |
| `testrail_delete_shared_step` | Delete shared step permanently | `#testrail_delete_shared_step shared_step_id: 10 confirmation: "I_UNDERSTAND_THIS_IS_IRREVERSIBLE_DELETE"` |
| `testrail_delete_variable` | Delete variable permanently | `#testrail_delete_variable variable_id: 5 confirmation: "I_UNDERSTAND_THIS_IS_IRREVERSIBLE_DELETE"` |

### 📎 **Attachment Operations (13 tools - File Management)**
| Command | Description | Example |
|---------|-------------|---------|
| `testrail_add_attachment_to_case` | Upload file to test case (max 256MB) | `#testrail_add_attachment_to_case case_id: 123 file_path: "C:\screenshots\test.png"` |
| `testrail_add_attachment_to_plan` | Upload file to test plan (max 256MB) | `#testrail_add_attachment_to_plan plan_id: 45 file_path: "C:\docs\plan.pdf"` |
| `testrail_add_attachment_to_plan_entry` | Upload file to test plan entry (max 256MB) | `#testrail_add_attachment_to_plan_entry plan_id: 45 entry_id: 12 file_path: "C:\logs\entry.log"` |
| `testrail_add_attachment_to_result` | Upload file to test result (max 256MB) | `#testrail_add_attachment_to_result result_id: 789 file_path: "C:\evidence\failure.png"` |
| `testrail_add_attachment_to_run` | Upload file to test run (max 256MB) | `#testrail_add_attachment_to_run run_id: 101 file_path: "C:\reports\summary.xlsx"` |
| `testrail_get_attachments_for_case` | List all attachments for test case | `#testrail_get_attachments_for_case case_id: 123 limit: 50` |
| `testrail_get_attachments_for_plan` | List all attachments for test plan | `#testrail_get_attachments_for_plan plan_id: 45 limit: 50` |
| `testrail_get_attachments_for_plan_entry` | List all attachments for plan entry | `#testrail_get_attachments_for_plan_entry plan_id: 45 entry_id: 12` |
| `testrail_get_attachments_for_run` | List all attachments for test run | `#testrail_get_attachments_for_run run_id: 101 limit: 50` |
| `testrail_get_attachments_for_result` | List all attachments for test result | `#testrail_get_attachments_for_result result_id: 789 limit: 50` |
| `testrail_get_attachments_for_test` | List all attachments for test | `#testrail_get_attachments_for_test test_id: 555 limit: 50` |
| `testrail_download_attachment` | Download attachment as base64 content | `#testrail_download_attachment attachment_id: 1234` |
| `testrail_delete_attachment` | Delete attachment permanently | `#testrail_delete_attachment attachment_id: 1234 confirmation: "I_UNDERSTAND_THIS_IS_PERMANENT"` |

## 📄 License

MIT License - see LICENSE for details.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Open an issue on GitHub
