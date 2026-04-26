# AGENTS.md

**特別な説明がない限り、全てのテキストとコメントは日本語で書く**

## Dev Commands

```bash
npm run dev     # Dev server at http://127.0.0.1:9090 (webpack-dev-server on port 3000)
npm run build   # Production build to server/public/app (prod) or dist (dev)
npm run serve   # Serve production build (requires ENV=PROD)
```

## Requirements

- **Node.js**: 22.22.1+ (enforced at build via `build/lib.js`)
- **External**: [ollama](https://ollama.com) must be running for AI features

## Build System

- Webpack 5 with custom config in `build/webpack5.js`
- Entry: `src/bootstrap.jsx` → `src/App.tsx`
- SSR: builds client + server bundles from same bootstrap (custom `#ifndef IS_NODE_TARGET` preprocessor via `sptc`)
- Path alias: `@` → `src/`
- Version check: `build/lib.js` validates Node.js and package versions against package.json

## State

- Uses `react-cross-component-state` (not Redux/Zustand)

## Docs

- `docs/ios-design-guide.md` - iOS Human Interface Guidelines design system
