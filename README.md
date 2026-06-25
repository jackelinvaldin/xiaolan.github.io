# 琢光绮梦官网

琢光绮梦官网是一个面向 Minecraft 服务器团队的展示与社区互动站点。项目包含首页、团队介绍、沉浸式服务器专区、图片相册、地图档案、公告、社区发言、个人空间、真实登录注册和管理员后台。

## 技术栈

- Next.js App Router + TypeScript
- Tailwind CSS v4
- Motion 动效
- Phosphor Icons
- Prisma + Postgres 数据库
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

## 数据库与登录

展示页在没有数据库时会使用预置内容方便预览。注册、登录、发布公告、社区留言、个人动态等真实写入功能需要 Postgres 数据库。

推荐使用 Neon Postgres、Prisma Postgres、Vercel Postgres 或 Supabase Postgres。Vercel 部署时只要配置 `DATABASE_URL`，构建前会自动执行 `prisma db push` 创建表结构。

本地开发可以创建 `.env.local`：

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
AUTH_SECRET=至少24位的随机字符串
ADMIN_USERNAME=xiaolan_admin
ADMIN_PASSWORD=你的管理员密码
ADMIN_DISPLAY_NAME=小蓝
```

初始化本地数据库：

```bash
npm run db:push
npm run db:seed
```

管理员账号不能注册。只有使用 `ADMIN_USERNAME` 和 `ADMIN_PASSWORD` 登录时，系统才会创建或更新管理员账号；其他注册用户全部是普通成员。

## Vercel 部署

1. 将项目推送到 GitHub。
2. 在 Vercel 导入该 GitHub 仓库。
3. Framework Preset 选择 Next.js。
4. 在 Vercel Project Settings 中配置环境变量：

```env
DATABASE_URL=你的 Postgres 连接串
AUTH_SECRET=至少24位的随机字符串
ADMIN_USERNAME=xiaolan_admin
ADMIN_PASSWORD=你的管理员密码
ADMIN_DISPLAY_NAME=小蓝
NEXT_PUBLIC_SITE_URL=https://你的域名
```

5. 点击 Deploy。
6. 部署完成后访问 `/login`，使用管理员账号登录，再进入 `/admin` 发布公告。

## 主要路由

- `/` 首页
- `/team` 团队介绍
- `/server` 服务器沉浸式三屏展示
- `/server/gallery` 服务器相册
- `/server/maps` 地图档案
- `/community` 社区发言区
- `/announcements` 公告列表
- `/profile` 我的个人空间
- `/login` 登录
- `/register` 注册
- `/admin` 管理员后台
