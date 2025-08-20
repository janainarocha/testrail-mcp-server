# TestRail MCP Server - Modular Structure & Architecture Guide

This document describes the modular structure of the TestRail MCP Server and explains how the code was developed, including the libraries used and fundamental concepts for those starting with MCP.

## 🎯 What is an MCP Server?

**Model Context Protocol (MCP)** is a protocol that allows AI assistants (like GitHub Copilot) to connect to external tools. Think of it as a "bridge" that allows AI to communicate with other systems.

**Our MCP Server** is this bridge between AI assistants and TestRail (test management tool). It translates simple commands like `#testrail_list_projects` into complex TestRail API calls.

## 📁 Current File Structure

```
src/
├── index.ts                    # 🎬 Main server entry point
├── api/                        # 🔌 Communication layer with TestRail
│   ├── index.ts               # Coordinator of all API clients
│   ├── testrail-base.ts       # Base client with authentication
│   ├── testrail-projects.ts   # Projects API
│   ├── testrail-cases.ts      # Test cases API
│   ├── testrail-suites.ts     # Suites API
│   ├── testrail-runs.ts       # Test runs API
│   ├── testrail-results.ts    # Results API
│   ├── testrail-plans.ts      # Test plans API
│   ├── testrail-sections.ts   # Sections API
│   ├── testrail-milestones.ts # Milestones API
│   ├── testrail-labels.ts     # Labels API
│   ├── testrail-reports.ts    # Reports API
│   ├── testrail-config.ts     # Configurations API
│   ├── testrail-priorities.ts # Priorities API
│   ├── testrail-statuses.ts   # Statuses API
│   ├── testrail-types.ts      # Case types API
│   ├── testrail-templates.ts  # Templates API
│   ├── testrail-casefields.ts # Custom fields API
│   ├── testrail-variables.ts  # Variables API (Enterprise)
│   ├── testrail-sharedSteps.ts# Shared steps API
│   └── testrail-tests.ts      # Individual tests API
└── tools/                      # 🛠️ MCP tools exposed to AI
    ├── index.ts               # Coordinator of all tools
    ├── project-tools.ts       # Project tools
    ├── case-tools.ts          # Test case tools
    ├── suites-tools.ts        # Suite tools
    ├── runs-tools.ts          # Test run tools
    ├── results-tools.ts       # Results tools
    ├── plan-tools.ts          # Plan tools
    ├── sections-tools.ts      # Section tools
    ├── milestones-tools.ts    # Milestone tools
    ├── label-tools.ts         # Label tools
    ├── search-tools.ts        # Advanced search tools
    ├── bulk-tools.ts          # Batch operations
    ├── config-tools.ts        # Configuration tools
    ├── report-tools.ts        # Report tools
    ├── statuses-tools.ts      # Status tools
    ├── templates-tools.ts     # Template tools
    ├── variables-tools.ts     # Variable tools
    ├── sharedSteps-tools.ts   # Shared step tools
    ├── tests-tools.ts         # Individual test tools
    └── health-tools.ts        # Diagnostic tools
```

## 🧠 How the Code Was Developed

### 1. **Layered Architecture**
```
🎯 AI Assistant (GitHub Copilot)
     ↕️ (MCP Protocol)
🛠️ Tools Layer (MCP Tools)
     ↕️ (Function/Method)
🔌 API Layer (TestRail Clients)
     ↕️ (HTTP/REST)
🏢 TestRail Server
```

### 2. **Design Patterns Used**
- **Separation of Concerns**: Each responsibility in a separate file
- **Factory Pattern**: Centralized API client creation
- **Command Pattern**: Each MCP tool is an independent command
- **Adapter Pattern**: API Layer adapts TestRail calls to MCP format

### 3. **Development Process**
1. **TestRail API Study**: Mapped all available endpoints
2. **API Client Creation**: One client for each functionality group
3. **MCP Tools Development**: Each tool exposed to AI
4. **Validation and Security**: Zod schemas to validate inputs
5. **Testing and Refinement**: Testing with real use cases

## 🚀 Libraries Used and Why

### **Core Dependencies**

#### 1. `@modelcontextprotocol/sdk` 
```typescript
// What it is: Official MCP SDK for TypeScript
// Why use it: Provides all necessary interfaces and types
// Usage example:
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
server.registerTool("my_tool", schema, handler);
```

#### 2. `zod`
```typescript
// What it is: TypeScript schema validation library
// Why use it: Ensures input data is correct
// Usage example:
const inputSchema = z.object({
  project_id: z.number().min(1).describe("Project ID"),
  title: z.string().min(1).describe("Test case title")
});
```

#### 3. `typescript`
```typescript
// What it is: JavaScript superset with static typing
// Why use it: Catches errors at development time, better autocomplete
// Benefits: 
// - Fewer bugs in production
// - IntelliSense in VS Code
// - Safe refactoring
```

### **Development Dependencies**

#### 4. `@types/node`
```typescript
// What it is: Type definitions for Node.js APIs
// Why use it: Allows using Node.js APIs with TypeScript typing
// Examples: fs, path, process, Buffer, etc.
```

## 🏗️ Detailed Architecture

### **Layer 1: API Clients (`/api`)**
```typescript
// Each client is responsible for a functionality group
class TestRailProjectsAPI {
  async getProjects() { 
    // Calls GET /api/v2/get_projects
    // Handles errors and formats response
  }
  
  async getProject(id: number) {
    // Calls GET /api/v2/get_project/{id}
    // Validates parameters and response
  }
}
```

**Why separate?**
- **Maintainability**: TestRail API changes affect only one file
- **Reusability**: Clients can be used in other tools
- **Testability**: Each client can be tested independently

### **Layer 2: MCP Tools (`/tools`)**
```typescript
// Each tool is a function that AI can call
export function registerProjectTools(server: McpServer, clients: APIClients) {
  server.registerTool(
    "testrail_list_projects",
    {
      description: "📋 List all accessible TestRail projects",
      inputSchema: z.object({}) // No parameters needed
    },
    async () => {
      const projects = await clients.projects.getProjects();
      return { content: [{ type: "text", text: JSON.stringify(projects, null, 2) }] };
    }
  );
}
```

**Why this structure?**
- **Clarity**: Each tool has a unique and well-defined purpose
- **Discovery**: AI can list and understand all available tools
- **Consistency**: All follow the same input/output pattern

## 🛠️ Tools by Category

### **🏢 Project Management**
- `testrail_list_projects` - List available projects
- `testrail_get_project` - Details of a specific project

### **📝 Test Case Management**
- `testrail_create_test_case` - Create new test cases
- `testrail_get_cases` - List cases with filters
- `testrail_update_test_case` - Update existing cases
- `testrail_delete_test_case` - Remove cases (with confirmation)

### **🔍 Search and Discovery**
- `testrail_search_test_cases_advanced` - Advanced search with multiple filters
- `testrail_get_case_metadata` - Metadata (types, priorities, fields)

### **⚡ Batch Operations**
- `testrail_update_test_cases_batch` - Update multiple cases
- `testrail_bulk_export_cases` - Export cases for backup

### **🔒 Security and Prevention**
- Mandatory confirmations for destructive operations
- Strict input validation with Zod
- Detailed logs for auditing

## 💡 For Beginners: How to Understand and Extend

### **1. How an MCP Tool Works**
```typescript
// 1. REGISTRATION: Server registers the tool
server.registerTool(
  "tool_name",                   // Unique name AI will use
  { 
    description: "What it does",  // AI uses to understand when to use
    inputSchema: z.object({...})  // What data the tool needs
  },
  async (input) => {              // What to do when called
    // Your logic here
    return { content: [...] };    // Response formatted for AI
  }
);

// 2. USAGE: AI calls the tool
// #tool_name param1=value1 param2=value2

// 3. RESPONSE: AI receives formatted result
```

### **2. How to Add New Functionality**
```typescript
// Step 1: Add method to appropriate API client
// file: src/api/testrail-projects.ts
async getProjectStats(projectId: number) {
  return this.request(`/get_project_stats/${projectId}`);
}

// Step 2: Register new MCP tool
// file: src/tools/project-tools.ts
server.registerTool(
  "testrail_get_project_stats",
  {
    description: "📊 Get detailed project statistics",
    inputSchema: z.object({
      project_id: z.number().describe("Project ID")
    })
  },
  async ({ project_id }) => {
    const stats = await clients.projects.getProjectStats(project_id);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(stats, null, 2)
      }]
    };
  }
);
```

### **3. How to Debug Problems**
```typescript
// Use console.log to trace flow
console.log("🔍 Calling tool:", toolName);
console.log("📥 Input received:", input);

try {
  const result = await apiCall();
  console.log("✅ Success:", result);
  return result;
} catch (error) {
  console.error("❌ Error:", error);
  throw error;
}
```

### **4. Code Patterns Followed**
```typescript
// ✅ GOOD: Descriptive names
const projectId = input.project_id;
const testCases = await clients.cases.getCases(projectId);

// ❌ BAD: Confusing names
const pid = input.pid;
const tc = await clients.c.getC(pid);

// ✅ GOOD: Error handling
try {
  return await apiCall();
} catch (error) {
  return { 
    error: error.message,
    details: "Context about what failed"
  };
}

// ❌ BAD: Ignoring errors
const result = await apiCall(); // Can break without warning
```

## 🔐 Security and Best Practices

### **1. Input Validation**
```typescript
// All inputs are validated with Zod
const schema = z.object({
  project_id: z.number().min(1).max(999999),
  title: z.string().min(1).max(250),
  priority: z.enum(['low', 'medium', 'high', 'critical'])
});
```

### **2. Confirmations for Dangerous Operations**
```typescript
// Destructive operations require explicit confirmation
const confirmationSchema = z.object({
  case_id: z.number(),
  confirmation: z.literal("I_UNDERSTAND_THIS_IS_IRREVERSIBLE_DELETE"),
  reason: z.string().min(10) // Must explain why deleting
});
```

### **3. Logs and Auditing**
```typescript
// All important operations are logged
console.log(`🗑️ Deleting test case ${caseId} - Reason: ${reason}`);
console.log(`👤 Operation performed by: ${user}`);
```

## 🎓 Resources to Learn More

### **MCP (Model Context Protocol)**
- [Official Documentation](https://spec.modelcontextprotocol.io/)
- [Server Examples](https://github.com/modelcontextprotocol)

### **TypeScript**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript for Beginners](https://www.youtube.com/watch?v=BwuLxPH8IDs)

### **Zod (Validation)**
- [Zod Documentation](https://zod.dev/)
- [Zod Practical Guide](https://zod.dev/README)

### **TestRail API**
- [TestRail API Documentation](https://www.gurock.com/testrail/docs/api)
- [Endpoint Reference](https://www.gurock.com/testrail/docs/api/reference)

## 🤝 How to Contribute

1. **Fork** the repository
2. **Clone** to your machine
3. **Install** dependencies: `npm install`
4. **Compile** the code: `npm run build`
5. **Test** locally: `npm run dev`
6. **Make** your changes
7. **Test** again
8. **Open** a Pull Request

---

**💡 Final Tip**: This MCP server is like an intelligent "API gateway" - it takes simple commands from AI and transforms them into complex TestRail operations, all in a safe and structured way!