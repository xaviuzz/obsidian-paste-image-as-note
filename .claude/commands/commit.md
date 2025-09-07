# Commit

Create well-formatted commits with conventional commit messages and emojis.

## 🚨 CRITICAL REQUIREMENTS

**MANDATORY COMMIT FORMAT:**
- **ONE LINE ONLY** - Never use multi-line commit messages
- **NO ATTRIBUTION** - Never add "Generated with Claude Code" or co-authoring credits
- **NO FOOTERS** - No additional metadata or acknowledgments
- **CLEAN FORMAT** - Just the conventional commit message with emoji

**Example:**
```
✅ CORRECT: ♻️ refactor: improve code readability with explaining variables
❌ WRONG:   ♻️ refactor: improve code readability
            
            🔧 Generated with [Claude Code](https://claude.ai/code)
            Co-Authored-By: Claude <noreply@anthropic.com>
```

## Features:

- Runs pre-commit checks by default (lint, build, generate docs)
- Automatically stages files if none are staged
- Uses conventional commit format with descriptive emojis
- Suggests splitting commits for different concerns

## Usage:

- `/commit` - Standard commit with pre-commit checks
- `/commit --no-verify` - Skip pre-commit checks

## Commit Types:

- ✨ feat: New features
- 🐛 fix: Bug fixes
- 📝 docs: Documentation changes
- ♻️ refactor: Code restructuring without changing functionality
- 🎨 style: Code formatting, missing semicolons, etc.
- ⚡️ perf: Performance improvements
- ✅ test: Adding or correcting tests
- 🧑‍💻 chore: Tooling, configuration, maintenance
- 🚧 wip: Work in progress
- 🔥 remove: Removing code or files
- 🚑 hotfix: Critical fixes
- 🔒 security: Security improvements

## Process:

1. Check for staged changes (`git status`)
2. If no staged changes, review and stage appropriate files
3. Run pre-commit checks (unless --no-verify)
4. Analyze changes to determine commit type
5. Generate descriptive one line commit message (NO ATTRIBUTION)
6. Execute commit with clean single-line format

## Best Practices:

- Keep commits atomic and focused
- Write in imperative mood ("Add feature" not "Added feature")
- Explain why, not just what
- Split unrelated changes into separate commits
- **ALWAYS use single-line format with no attribution**
- Use conventional commit format: `emoji type: description`

## Format Examples:

```bash
# Correct single-line commits:
git commit -m "✨ feat: add folder selection modal component"
git commit -m "🐛 fix: resolve image loading timeout issue"
git commit -m "♻️ refactor: extract icon paths to separate data file"
git commit -m "📝 docs: update development setup instructions"

# NEVER do this (multi-line with attribution):
git commit -m "$(cat <<'EOF'
✨ feat: add folder selection modal

🔧 Generated with [Claude Code](https://claude.ai/code)
Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```
