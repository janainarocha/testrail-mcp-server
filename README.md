# TestRail MCP Server

A comprehensive Model Context Protocol (MCP) server that enables AI assistants to interact with TestRail for automated test case management and execution. This server provides **complete TestRail REST API v2 coverage** with 39 MCP tools organized by safety levels.

## � Complete TestRail Platform Coverage

This MCP server provides **100% coverage** of the TestRail platform with **67 API methods** and **39 MCP tools** across all major TestRail functionality:

## 🚀 Two Ways to Use

### Option 1: Quick Setup (Recommended)

Add this to your VS Code `mcp.json` file:

```json
{
  "servers": {
    "testrail": {
      "command": "npx",
      "args": [
        "github:janainarocha/testrail-mcp-server"
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

**That's it!** Restart VS Code and use `@testrail` commands.

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
        "TESTRAIL_URL": "https://fugroroadware.testrail.com",
        "TESTRAIL_USER": "your.email@fugro.com",
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

**Note:** This is a global configuration that works across all VS Code projects.

### 3. Update Configuration
Replace `your.email@company.com` and `your-api-key` with your actual credentials.

### 4. Restart VS Code

## 💬 Usage Examples

### 🔍 **SAFETY FIRST: Always Preview Before Creating**

**Step 1: Preview test cases (REQUIRED for batch)**
```
@testrail preview 5 test cases for login functionality in project 1, section 10
```

**Step 2: Create ALL previewed test cases**
```
@testrail create all the previewed test cases after confirmation
```

**Step 2 Alternative: Create SELECTED test cases only**
```
@testrail create only test cases 1, 3, and 5 from the preview
```

### 🚨 **SAFE DELETE: Always Preview Before Deleting**

**Step 1: Preview what will be deleted**
```
@testrail preview delete of test case 123
```

**Step 2: Confirm deletion with reason**
```
@testrail delete test case 123 - reason: duplicate test case
```

### Basic Operations

### List Projects
```
@testrail list all projects
```

### Create Individual Test Cases
```
@testrail create a test case for user login:
Title: Test successful user authentication
Section ID: 5
Steps:
1. Navigate to login page
2. Enter valid credentials
3. Click login button
Expected: User should be redirected to dashboard
Priority: High
```

### Explore Structure
```
@testrail show me sections in project 1
@testrail list test cases in section 12
@testrail show details of test case 456
```

### Create Sections
```
@testrail create a new section called "API Tests" in suite 3
```

## �️ Safety Features

### 🔍 Preview Before Creation (REQUIRED for Batch Operations)
To prevent accidental creation of hundreds of test cases, this server includes safety features:

#### Available Safety Tools:
1. **`preview_test_cases_batch`** - Shows exactly what will be created
2. **`create_test_cases_batch_confirmed`** - Creates only after explicit confirmation
3. **`preview_delete_test_case`** - Shows what will be deleted
4. **`delete_test_case_confirmed`** - Deletes only after preview and reason

#### 🎯 **Selective Creation Workflow:**
```
User: "Create 50 test cases for login functionality"

🔍 AI: Uses preview_test_cases_batch to show:
   ┌─────────────────────────────────────────┐
   │ 📋 PREVIEW: 50 test cases will be created │
   │ Project: MyApp (ID: 1)                   │
   │ Section: Login Tests (ID: 10)            │
   │                                         │
   │ 1. Test valid login credentials         │
   │ 2. Test invalid password               │
   │ 3. Test locked account                 │
   │ 4. Test password reset flow           │
   │ 5. Test social media login            │
   │ ... (45 more)                         │
   │                                         │
   │ ⚠️  REVIEW CAREFULLY BEFORE PROCEEDING   │
   └─────────────────────────────────────────┘

👤 User: "Too many! Create only tests 1, 4, 10, and 25"

✅ AI: Uses create_test_cases_batch_confirmed with:
   - selected_indexes: [1, 4, 10, 25]
   - Creates only 4 specific test cases

🎯 Result: Only the selected test cases are created!
```

#### 🚨 **Safe Delete Workflow:**
```
User: "Delete test case 123"

🔍 AI: Uses preview_delete_test_case to show:
   ┌─────────────────────────────────────────┐
   │ 🚨 DELETE PREVIEW                        │
   │ Test Case ID: 123                       │
   │ Title: "Test duplicate login scenario"  │
   │ Type: Steps                             │
   │ Priority: Medium                        │
   │                                         │
   │ ⚠️ DELETION IS IRREVERSIBLE!            │
   └─────────────────────────────────────────┘

👤 User: "Yes, delete it - it's a duplicate case"

🗑️ AI: Uses delete_test_case_confirmed with:
   - reason: "it's a duplicate case"
   - Permanently deletes the test case
```

#### Benefits:
- ✅ **No accidental mass creation**
- ✅ **User control over what gets created**  
- ✅ **Selective creation** - pick specific test cases by number
- ✅ **Advanced search & filtering** - find exactly what you need
- ✅ **Batch operations** - copy, move, update multiple cases
- ✅ **Complete audit trail** - track all changes with history
- ✅ **Attachment management** - handle files and documents
- ✅ **Safe delete with preview** - see before you delete
- ✅ **Mandatory reasons for deletion** - audit trail
- ✅ **Metadata discovery** - understand available fields and types
- ✅ **Process in 2 steps** (Preview → Confirm)

## �🛠️ Prerequisites

- **Node.js 18+** (for local installation)
- **VS Code** with **GitHub Copilot** extension
- **TestRail account** with API access
- **TestRail API key**

## 🤝 Team Sharing

### For Quick Setup Users:
Share the `mcp.json` configuration with team members. Each person just needs to:
1. Update with their own credentials
2. Restart VS Code
3. Start using `@testrail` commands

### For Local Installation Users:
1. Share the repository
2. Each person clones and installs
3. Everyone creates their own `.env` file
4. Configure their VS Code `mcp.json`

## 🔍 Troubleshooting

### Server Not Appearing
- Check VS Code `mcp.json` file location and syntax
- Restart VS Code completely
- Verify GitHub Copilot extension is installed

### Authentication Errors
- Verify TestRail URL is correct (without trailing slash)
- Check API key is valid and active
- Confirm user has project access

### Commands Not Working
- Ensure you're using GitHub Copilot Chat (not regular terminal)
- Start commands with `@testrail`
- Check VS Code output logs for errors

## 📋 Complete Command Reference

### 👀 **Read Operations (Safe)**
| Command | Description | Example |
|---------|-------------|---------|
| `list_projects` | List all accessible TestRail projects | `@testrail list all projects` |
| `get_project` | Get project details with suites | `@testrail show project 5 details` |
| `get_suites` | List test suites in a project | `@testrail list suites in project 3` |
| `list_sections` | List sections in a suite | `@testrail show sections in suite 10` |
| `list_test_cases` | List test cases in a section | `@testrail list test cases in section 12` |
| `get_test_case` | Get detailed test case information | `@testrail show details of test case 456` |
| `search_test_cases_advanced` | 🔍 Advanced search with filters | `@testrail search test cases with priority high in project 1` |
| `get_project_milestones` | 🎯 Get milestones for project planning | `@testrail list milestones for project 3` |
| `get_project_labels` | 🏷️ Get labels for test case organization | `@testrail show labels in project 5` |
| `get_user_groups` | 👥 Get user groups and team structure | `@testrail list user groups` |
| `get_test_runs` | 🏃 Get test runs for a project | `@testrail list test runs for project 2` |
| `get_shared_steps` | 🔗 Get shared steps for reusable procedures | `@testrail show shared steps for project 1` |
| `get_test_statuses` | 📊 Get test result statuses | `@testrail show available test statuses` |
| `get_user_roles` | 👤 Get user roles and permissions | `@testrail list user roles` |
| `get_case_metadata` | Get complete metadata for fields/types | `@testrail show metadata for project 2` |
| `get_test_case_attachments` | 📎 Get attachments for a test case | `@testrail show attachments for case 789` |
| `get_test_case_history` | 📜 Get change history and audit trail | `@testrail show history of test case 123` |
| `get_test_case_history` | 📜 Get change history/audit trail | `@testrail show history of test case 123` |
| `get_test_case_attachments` | 📎 List attachments for test case | `@testrail show attachments for test case 456` |
| `get_case_metadata` | 📊 Get available types and custom fields | `@testrail show available case types and fields` |

### ➕ **Create Operations (Individual)**
| Command | Description | Example |
|---------|-------------|---------|
| `create_section` | Create new organizational section | `@testrail create section "API Tests" in suite 3` |
| `create_text_test_case` | Create simple text-based test case | `@testrail create text test case for login validation` |
| `create_steps_test_case` | Create test case with structured steps | `@testrail create steps test case for user registration` |
| `create_exploratory_test_case` | Create exploratory test case | `@testrail create exploratory test for mobile app` |

### 🔍 **Preview Operations (Safety First)**
| Command | Description | Example |
|---------|-------------|---------|
| `preview_test_cases_batch` | Preview multiple test cases before creation | `@testrail preview 10 test cases for checkout flow` |
| `preview_delete_test_case` | Preview what will be deleted | `@testrail preview delete of test case 123` |
| `preview_delete_milestone` | 🎯 Preview milestone deletion impact | `@testrail preview delete milestone 15` |

### ✅ **Confirmed Operations (Requires Preview)**
| Command | Description | Example |
|---------|-------------|---------|
| `create_test_cases_batch_confirmed` | Create multiple test cases after preview | `@testrail create the previewed test cases 1, 4, and 10` |
| `create_milestone` | 🎯 Create project milestone for planning | `@testrail create milestone "Release 2.0" for project 3 due 2024-12-31` |
| `create_test_run` | 🚀 Create new test run for execution | `@testrail create test run "Sprint 5 Testing" for project 2 suite 10` |
| `create_test_suite` | 📁 Create new test suite for organization | `@testrail create suite "API Tests" for project 1` |
| `update_milestone_status` | 🎯 Update milestone status/details | `@testrail mark milestone 10 as completed` |

### 🔄 **Batch Operations (Advanced)**
| Command | Description | Example |
|---------|-------------|---------|
| `copy_test_cases` | Copy test cases to another section | `@testrail copy test cases 1,2,3 to section 15` |
| `move_test_cases` | Move test cases to another section/suite | `@testrail move test cases 4,5,6 to section 20 suite 3` |
| `update_test_cases_batch` | Update multiple cases with same values | `@testrail set priority high for test cases 10,11,12` |

### 🚨 **Delete Operations (Critical - Irreversible)**
| Command | Description | Example |
|---------|-------------|---------|
| `delete_test_case_confirmed` | Delete test case permanently | `@testrail delete test case 456 - duplicate case` |
| `delete_milestone_confirmed` | 🎯 Delete milestone permanently | `@testrail delete milestone 15 reason "Project cancelled"` |

### 🛡️ Safety Levels:
- **👀 Read**: No changes to TestRail
- **➕ Individual**: Creates 1 item at a time
- **🔍 Preview**: Shows what will happen, makes no changes
- **✅ Confirmed**: Requires explicit confirmation
- **🔄 Batch**: Advanced operations with confirmations
- **🚨 Delete**: Irreversible operations with mandatory preview

## 📝 Usage Examples with New Features

### 🎯 **Selective Batch Creation**
```
User: "Preview 20 test cases for payment processing"
AI: Shows all 20 test cases with numbers

User: "Create only test cases 1, 4, 7, and 15"
AI: Creates only the selected 4 test cases
```

### � **Advanced Search & Filtering**
```
User: "Find all high priority test cases created last week in project 5"
AI: Uses advanced search with date and priority filters

User: "Search for test cases containing 'login' in title"
AI: Returns filtered results with text search
```

### 🔄 **Batch Operations**
```
User: "Copy test cases 100, 101, 102 to section 25"
AI: Copies cases (originals remain) to new section

User: "Change priority to Critical for test cases 50-60"
AI: Batch updates all specified cases with new priority
```

### 📜 **Audit & History**
```
User: "Show me who changed test case 123 and when"
AI: Displays complete change history with users and timestamps
```

### 📎 **Attachment Management**
```
User: "List all attachments for test case 456"
AI: Shows files, sizes, upload dates, and users
```

### �🛡️ **Safe Delete Process**
```
User: "I want to delete test case 123"
AI: "Let me show you what will be deleted first..."
     Uses preview_delete_test_case

User: "Yes, delete it - it's a duplicate"
AI: Uses delete_test_case_confirmed with reason
```

## 🚀 **Advanced Features**

### 🔍 **Powerful Search Capabilities**
- **Text Search**: Find cases by title content
- **Priority Filtering**: Filter by Low, Medium, High, Critical
- **Date Ranges**: Cases created/updated within specific periods  
- **Type Filtering**: Filter by Automated, Functional, etc.
- **Multi-Project**: Search across different projects
- **Pagination**: Handle large result sets efficiently

### 📊 **Metadata Discovery**
```
User: "Show me all available test case types and custom fields for project 5"
AI: Lists case types (Functional, API, UI) and custom fields (Environment, Browser, etc.)

User: "What milestones do we have for project 3?"
AI: Shows all milestones with due dates, completion status, and descriptions
```

### 🎯 **Milestone Management**
```
User: "Create milestone for Release 2.0 due December 31st for project 3"
AI: Creates milestone with name, due date, and project association

User: "Mark milestone 15 as completed"
AI: Updates milestone status to completed

User: "Show me all active milestones for project 5"
AI: Lists milestones filtered by completion status
```

### � **Test Run Management**
```
User: "Create a test run for Sprint 5 testing in project 2"
AI: Creates test run with suite selection and milestone linking

User: "Show me all active test runs for project 3"  
AI: Lists test runs with pass rates, execution status, and progress

User: "Show completed test runs from last month"
AI: Filters test runs by completion status and date range
```

### 🔗 **Shared Steps and Reusability**
```
User: "Show me shared steps for project 1"
AI: Lists reusable test step libraries with usage counts

User: "What shared steps are available for login procedures?"
AI: Shows shared step sets for common test procedures
```

### 📊 **Test Execution and Status**
```
User: "What test result statuses can I use?"
AI: Shows all available statuses (Passed, Failed, Blocked, etc.)

User: "Show me user roles and permissions"
AI: Lists roles with permission levels and admin rights
```

### 📁 **Suite and Structure Management**
```
User: "Create a new test suite for API testing in project 5"
AI: Creates organized test suite for specific testing types

User: "Show me the test structure for project 2"
AI: Displays suites, sections, and organizational hierarchy
```

### 🔄 **Batch Operations**
- **Copy Cases**: Duplicate cases to other sections (originals remain)
- **Move Cases**: Relocate cases to different suites/sections
- **Batch Updates**: Change multiple cases with same values
- **Selective Operations**: Choose specific cases from previews

### 📜 **Audit & Compliance**
- **Change History**: Complete audit trail of modifications
- **User Tracking**: See who made what changes when
- **Field-Level Changes**: Detailed before/after comparisons
- **Timestamp Records**: Precise change timing

### 📎 **File Management**
- **Attachment Listing**: See all files attached to cases
- **File Details**: Sizes, types, upload dates
- **User Attribution**: Know who uploaded what
- **Bulk Discovery**: Find cases with/without attachments

## 📄 License

MIT License - see LICENSE for details.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Contact your team's TestRail administrator
