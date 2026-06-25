# 琢光绮梦官网

琢光绮梦官网是一个面向 Minecraft 服务器团队的展示与社区互动站点。项目包含首页、团队介绍、沉浸式服务器专区、图片相册、地图档案、公告、社区发言、个人空间、登录注册预览和管理员后台。

## 技术栈

- Next.js App Router + TypeScript
- Tailwind CSS v4
- Motion 动效
- Phosphor Icons
- Prisma + Postgres 数据层预留
- Vercel 部署兼容

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000` 预览。

## 构建检查

```bash
npm run lint
npm run build
```

## 数据库

当前项目默认使用本地 mock 数据，方便直接预览和部署。需要接入真实数据库时：

1. 创建 Supabase、Neon、Vercel Postgres 或其他 Postgres 数据库。
2. 将连接串写入 `.env.local`：

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

3. 执行：

```bash
npm run db:push
npm run db:seed
```

API 路由在检测到 `DATABASE_URL` 后会走 Prisma 数据层。

## Vercel 部署

1. 将项目推送到 GitHub。
2. 在 Vercel 导入该 GitHub 仓库。
3. Framework Preset 选择 Next.js。
4. MVP mock 预览不需要环境变量。
5. 如果启用数据库，在 Vercel Project Settings 中配置 `DATABASE_URL`。
6. 点击 Deploy。

## 主要路由

- `/` 首页
- `/team` 团队介绍
- `/server` 服务器沉浸式三屏展示
- `/server/gallery` 服务器相册
- `/server/maps` 地图档案
- `/community` 社区发言区
- `/announcements` 公告列表
- `/profile` 我的个人空间
- `/login` 登录预览
- `/register` 注册预览
- `/admin` 管理员后台
