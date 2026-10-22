# 智能任务管理系统

一个基于 Node.js（NestJS）+ React + PostgreSQL（Drizzle ORM）的全栈任务管理系统，中文界面。

## 功能

- 添加任务：输入框 + 优先级下拉（高 / 中 / 低），支持回车提交
- 任务列表：显示标题、优先级标签、完成状态，按创建时间倒序排列
- 完成切换：勾选复选框切换完成 / 未完成，已完成任务标题显示删除线
- 删除任务：每条任务右侧一键删除
- 优先级筛选：全部 / 高 / 中 / 低
- 数据持久化：任务数据真实保存到数据库

## 技术栈

- 前端：React 19 + Vite + Tailwind CSS（shadcn 风格组件）
- 后端：NestJS 10 + Drizzle ORM
- 数据库：PostgreSQL（通过 Drizzle 访问）

## 项目结构

```
├── client/          # 前端（React + Vite）
│   └── src/
│       ├── api/         # 接口封装
│       ├── components/  # 业务组件 + UI 组件
│       ├── pages/       # 页面（TaskPage 任务管理页）
│       └── types/       # 类型定义
├── server/          # 后端（NestJS）
│   ├── modules/tasks/
│   │   ├── dto/             # 请求校验
│   │   └── repositories/    # 数据访问层（Repository 模式）
│   └── database/schema.ts   # 数据库表定义
└── shared/          # 前后端共享类型
```

## 本地运行

```bash
npm install
npm run dev        # 开发模式
npm run build      # 构建
npm start          # 生产模式
```

默认地址：http://localhost:3000

## 数据访问层设计（Repository 模式）

任务数据访问通过 `TaskRepository` 抽象接口实现，当前使用 Drizzle + PostgreSQL：

```
server/modules/tasks/repositories/
├── task.repository.ts          # 抽象接口
├── drizzle-task.repository.ts  # 当前实现（Drizzle + PostgreSQL）
└── supabase-task.repository.ts # Supabase 占位实现（预留）
```

如需接入 Supabase：实现 `SupabaseTaskRepository`（用 @supabase/supabase-js 替换 Drizzle 调用），并在 `tasks.module.ts` 中把 provider 的 `useClass` 换成 `SupabaseTaskRepository` 即可，Service 与 Controller 层无需改动。

> 说明：本工程基于全栈开发平台模板生成，部分运行依赖平台包（`@lark-apaas/*`）；核心业务代码（任务 CRUD、前端页面）为项目自有实现。
