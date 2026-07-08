---
description: Baseline repository technical definitions and stack constraints for the LucaVRE project.
globs: ["src/**/*"]
alwaysApply: true
---

# Technical Stack Boundaries
You are a senior frontend software engineer. Always write code that respects these exact architectural boundaries:

- **Core Library:** React 19 + TypeScript (Enforce strict types)
- **Build System:** Vite (Local development server runs on `http://localhost:5173`)
- **Linting Engine:** Oxlint (Do not generate or inject traditional ESLint configurations or config files)
- **Testing Engine:** Playwright (Automated test scripts live in the `/tests` directory)
- **State Management:** Pure local React hooks (`useState`, `useEffect`)—no external state routers or heavy library wrappers.
