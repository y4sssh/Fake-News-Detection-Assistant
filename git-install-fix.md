# Git Installation Fix

**Issue:** Git for Windows installer \"Run Detection\" failed with \"Failed to fetch\".

**Diagnosis:**
- Git already installed (v2.53.0.windows.2).
- Network fine (ping git-scm.com ok, no proxy).
- Core Git functional (git status works).

**Resolution:**
- Use `winget upgrade --id Git.Git -e --source winget` or re-run installer.
- No code changes needed.

Test: `git --version` && `git status`.
