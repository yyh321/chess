# 开发指南

## 启动开发服务器
```bash
pnpm dev
```

## 运行测试
```bash
npx vitest run
```

## 构建生产包
```bash
pnpm build
```

## 项目结构
- `src/components/` — React UI 组件
- `src/store/` — Zustand 状态管理
- `src/engine/rules/` — 象棋走法规则引擎
- `src/engine/ai/` — AI 评估与搜索
- `tests/` — 单元测试

## 添加新规则
在 `src/engine/rules/` 下新建文件，导出 `getXXXMoves` 函数，
然后在 `src/engine/rules/index.ts` 的 `moveMap` 中注册。
