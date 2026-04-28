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

## ダークモード対応

- コンポーネントで `useDarkMode()` from `@/store/globalSettingStore` を使用
- `dark-mode` クラスを親要素に追加して样式を切り替え
- 既存の SCSS に `.dark-mode` スタイルを追加する形式（例: `.chat-bot-container.dark-mode`）

## Git Commit 格式

コミットメッセージは以下の形式で作成する：

```
# feat
- 機能追加の説明

# fix
- バグ修正の説明
- 別の修正
```

- 変更タイプ別に分類（feat, fix, refactor, docs等）
- 各タイプ内で変更内容を箇条書きで列挙
- メッセージは日本語で記述

## Docs

- `docs/ios-design-guide.md` - iOS Human Interface Guidelines design system