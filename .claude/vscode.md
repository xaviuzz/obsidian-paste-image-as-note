# Claude Code Instructions

## VSCode IDE Capabilities Priority

### When to Use IDE Tools vs Manual Tools

**ALWAYS PRIORITIZE IDE TOOLS FOR:**
1. **Symbol operations** - Use `mcp__vscode__rename_symbol` instead of multiple Edit calls
2. **Code diagnostics** - Use `mcp__vscode__get_diagnostics` instead of running tsc/eslint commands
3. **Code analysis** - Use `mcp__vscode__get_definition`, `mcp__vscode__get_references`, `mcp__vscode__get_hovers`
4. **File opening** - Use `mcp__vscode__open_files` with `showEditor: false` for background loading

**Token-Efficient IDE Usage:**

### 1. Diagnostics Over Manual Commands
```
❌ AVOID: Bash("npm run typecheck") 
✅ USE: mcp__vscode__get_diagnostics(uris: [])
```
- Gets instant results without running full build
- Returns precise error locations
- Saves tokens from command output

### 2. Symbol Renaming
```
❌ AVOID: Multiple Edit() calls across files
✅ USE: mcp__vscode__rename_symbol()
```
- Single operation renames across entire codebase
- LSP ensures accuracy
- Avoids reading multiple files

### 3. Batch File Operations
```
✅ USE: mcp__vscode__open_files([
  { uri: "file1", showEditor: false },
  { uri: "file2", showEditor: false }
])
```
- Loads files for LSP without UI clutter
- Enables accurate diagnostics
- Prepares files for analysis

### 4. Code Understanding
```
❌ AVOID: Reading entire files to understand types
✅ USE: mcp__vscode__get_hovers() for type info
✅ USE: mcp__vscode__get_definition() for symbol locations
```

### Setup Requirements
- Ensure VSCode MCP Bridge extension is active
- Use `mcp__vscode__list_workspaces()` to verify connection
- Always provide correct workspace_path

### Token Optimization Rules
1. Use IDE tools for symbol operations (saves file reading tokens)
2. Get diagnostics via LSP not command execution 
3. Batch operations when possible
4. Use `showEditor: false` for background file loading
5. Prefer LSP-based analysis over manual file inspection