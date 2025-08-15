# TestRail MCP Server - Copilot Instructions

## Project Overview
This is a Model Context Protocol (MCP) server that enables AI assistants to automatically create test cases in TestRail through the TestRail API. The server provides tools for:
- Creating test cases with different templates (Text, Steps, Exploratory)
- Managing projects, sections, and suites
- Retrieving test case information
- Handling authentication with TestRail

## Key Technologies
- TypeScript/Node.js for the MCP server
- TestRail REST API v2
- Model Context Protocol (MCP) specification
- HTTP Basic Authentication

## Project Structure
- `src/` - TypeScript source files
- `dist/` - Compiled JavaScript output
- `docs/` - Documentation and examples
- Configuration files for TypeScript, npm, and MCP

## Development Guidelines
- Follow TypeScript strict mode practices
- Implement proper error handling for API calls
- Use environment variables for sensitive configuration
- Provide comprehensive JSDoc documentation
- Include examples for each MCP tool

## TestRail Integration
- Support for TestRail Cloud and Server instances
- API key authentication recommended over password
- Handle rate limiting and error responses
- Support for custom fields and templates

## MCP SDK Reference
- TypeScript SDK: https://github.com/modelcontextprotocol/typescript-sdk
- Follow MCP specification: https://spec.modelcontextprotocol.io/
- Use @modelcontextprotocol/sdk package
- Implement stdio transport for local servers

---
**Status:** ✅ Copilot instructions updated with MCP SDK info
