# 个人日程管理系统 - 技术架构设计

## 项目概述

一个集成了日程管理、笔记、任务、财务规划的个人管理系统，特别为学生和实习人士设计，支持Docker部署。

## 核心功能模块

### 1. 日程管理模块 (Calendar)
- 日历视图（日/周/月/年）
- 事件创建、编辑、删除
- 重复事件支持
- 事件分类和标签
- 拖拽调整时间

### 2. 笔记模块 (Notes - 类似Flomo)
- 快速记录笔记
- Markdown支持
- 标签系统
- 全文搜索
- 笔记关联（关联到日程/任务）

### 3. 任务管理模块 (Tasks)
- 待办清单
- 任务优先级
- 子任务支持
- 进度跟踪
- 截止日期提醒

### 4. 财务规划模块 (Finance)
- 收支记录
- 预算管理
- 账单提醒
- 财务报表
- 分类统计

### 5. 提醒系统 (Notifications)
- 多种提醒方式
- 自定义提醒时间
- 重要事项突出
- 推送通知

### 6. 学习工作平衡模块 (Work-Life Balance)
- 时间统计分析
- 专注时间记录
- 番茄钟功能
- 效率分析报告
- 休息提醒

## 技术栈方案

### 方案一：现代全栈 JavaScript（推荐）

#### 前端
- **框架**: React 18 + TypeScript
- **UI组件库**: Ant Design / Material-UI
- **状态管理**: Zustand / Redux Toolkit
- **日历组件**: FullCalendar / React Big Calendar
- **路由**: React Router v6
- **富文本编辑器**: Slate.js / Tiptap
- **图表**: Recharts / ECharts
- **构建工具**: Vite
- **样式**: TailwindCSS + CSS Modules

#### 后端
- **运行时**: Node.js 20 LTS
- **框架**: Express.js / Fastify / NestJS
- **语言**: TypeScript
- **API风格**: RESTful API + GraphQL (可选)
- **认证**: JWT + Refresh Token
- **定时任务**: node-cron / bull
- **文件处理**: Multer
- **数据验证**: Zod / Joi

#### 数据库
- **主数据库**: PostgreSQL 16 (结构化数据)
- **缓存**: Redis 7 (会话、缓存)
- **搜索引擎**: PostgreSQL Full-Text Search / ElasticSearch (可选)

#### DevOps
- **容器化**: Docker + Docker Compose
- **反向代理**: Nginx
- **进程管理**: PM2 (容器内)
- **日志**: Winston + Morgan
- **监控**: Prometheus + Grafana (可选)

---

### 方案二：Python 后端方案

#### 前端
- 同方案一

#### 后端
- **语言**: Python 3.11+
- **框架**: FastAPI / Django
- **ORM**: SQLAlchemy / Django ORM
- **异步**: asyncio + uvicorn
- **任务队列**: Celery + Redis
- **认证**: JWT + OAuth2

#### 数据库
- **主数据库**: PostgreSQL 16
- **缓存**: Redis 7
- **任务队列**: Redis (Celery broker)

---

### 方案三：Go 后端方案（高性能）

#### 前端
- 同方案一

#### 后端
- **语言**: Go 1.21+
- **框架**: Gin / Fiber / Echo
- **ORM**: GORM
- **定时任务**: cron
- **认证**: JWT

#### 数据库
- **主数据库**: PostgreSQL 16
- **缓存**: Redis 7

---

## 推荐方案：方案一（全栈 TypeScript）

### 优势
1. **类型安全**: 前后端统一使用TypeScript，减少类型错误
2. **开发效率**: 前后端可共享类型定义和工具函数
3. **生态丰富**: npm生态系统完善，轮子多
4. **学习曲线**: 对学生友好，一门语言搞定全栈
5. **社区活跃**: 问题容易找到解决方案
6. **实时功能**: 易于集成WebSocket实现实时通知

## 系统架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  React SPA (TypeScript)                             │   │
│  │  - 日程管理界面                                      │   │
│  │  - 笔记编辑器                                        │   │
│  │  - 任务看板                                          │   │
│  │  - 财务报表                                          │   │
│  │  - 数据分析面板                                      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTP/HTTPS + WebSocket
┌─────────────────────────────────────────────────────────────┐
│                      Nginx (反向代理)                        │
│  - 静态文件服务                                              │
│  - 请求转发                                                  │
│  - SSL终止                                                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Node.js Backend (TypeScript + Express/NestJS)      │   │
│  │                                                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │ Calendar │  │  Notes   │  │  Tasks   │          │   │
│  │  │  Service │  │  Service │  │  Service │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘          │   │
│  │                                                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │ Finance  │  │  Notify  │  │ Balance  │          │   │
│  │  │  Service │  │  Service │  │  Service │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘          │   │
│  │                                                       │   │
│  │  ┌──────────────────────────────────────┐           │   │
│  │  │     Auth & User Management           │           │   │
│  │  └──────────────────────────────────────┘           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │   PostgreSQL     │  │      Redis       │                │
│  │                  │  │                  │                │
│  │  - 用户数据      │  │  - Session缓存   │                │
│  │  - 日程事件      │  │  - 频繁查询缓存  │                │
│  │  - 笔记内容      │  │  - 任务队列      │                │
│  │  - 任务记录      │  │  - 实时通知      │                │
│  │  - 财务数据      │  │                  │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

## 数据库设计概要

### 核心表结构

#### 用户表 (users)
- id, username, email, password_hash
- created_at, updated_at
- settings (JSONB)

#### 日程表 (calendar_events)
- id, user_id, title, description
- start_time, end_time, all_day
- repeat_rule (JSONB)
- category, tags (JSONB)
- reminder_settings (JSONB)

#### 笔记表 (notes)
- id, user_id, content, markdown
- tags (JSONB)
- linked_events (Array)
- linked_tasks (Array)
- created_at, updated_at

#### 任务表 (tasks)
- id, user_id, title, description
- status, priority, progress
- due_date, completed_at
- parent_task_id (自引用)

#### 财务表 (finance_records)
- id, user_id, type (income/expense)
- amount, category, description
- date, tags (JSONB)

#### 时间统计表 (time_tracking)
- id, user_id, activity_type
- start_time, end_time, duration
- category (study/work/rest)

## Docker 部署架构

```yaml
services:
  frontend:
    - Nginx + React Build
    - Port: 80, 443

  backend:
    - Node.js Application
    - Port: 3000 (内部)

  postgres:
    - PostgreSQL 16
    - Port: 5432 (内部)
    - Volume: postgres_data

  redis:
    - Redis 7
    - Port: 6379 (内部)
    - Volume: redis_data

networks:
  - app-network (内部网络)

volumes:
  - postgres_data (持久化)
  - redis_data (持久化)
```

## API 设计规范

### RESTful API 结构
```
/api/v1/
  ├── /auth
  │   ├── POST /register
  │   ├── POST /login
  │   └── POST /refresh
  ├── /calendar
  │   ├── GET /events
  │   ├── POST /events
  │   ├── PUT /events/:id
  │   └── DELETE /events/:id
  ├── /notes
  │   ├── GET /notes
  │   ├── POST /notes
  │   ├── PUT /notes/:id
  │   └── DELETE /notes/:id
  ├── /tasks
  │   ├── GET /tasks
  │   ├── POST /tasks
  │   ├── PUT /tasks/:id
  │   └── DELETE /tasks/:id
  ├── /finance
  │   ├── GET /records
  │   ├── POST /records
  │   ├── GET /statistics
  │   └── GET /budget
  └── /analytics
      ├── GET /time-tracking
      └── GET /balance-report
```

## 安全考虑

1. **认证授权**: JWT + HttpOnly Cookie
2. **密码加密**: bcrypt (salt rounds: 12)
3. **SQL注入防护**: 参数化查询 (ORM)
4. **XSS防护**: Content Security Policy + 输入验证
5. **CSRF防护**: SameSite Cookie + CSRF Token
6. **速率限制**: express-rate-limit
7. **HTTPS**: 生产环境强制HTTPS
8. **环境变量**: 敏感信息使用.env文件

## 开发工具链

- **代码规范**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged
- **测试**: Jest + React Testing Library + Supertest
- **API文档**: Swagger / OpenAPI
- **类型检查**: TypeScript strict mode
- **CI/CD**: GitHub Actions (可选)

## 项目目录结构（建议）

```
planning-helper/
├── frontend/                 # 前端应用
│   ├── src/
│   │   ├── components/      # 组件
│   │   ├── pages/           # 页面
│   │   ├── hooks/           # 自定义hooks
│   │   ├── services/        # API调用
│   │   ├── store/           # 状态管理
│   │   ├── utils/           # 工具函数
│   │   └── types/           # TypeScript类型
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # 后端应用
│   ├── src/
│   │   ├── controllers/     # 控制器
│   │   ├── services/        # 业务逻辑
│   │   ├── models/          # 数据模型
│   │   ├── routes/          # 路由
│   │   ├── middleware/      # 中间件
│   │   ├── utils/           # 工具函数
│   │   └── types/           # TypeScript类型
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                   # 前后端共享代码
│   └── types/               # 共享类型定义
│
├── docker/                   # Docker配置
│   ├── nginx/
│   │   └── nginx.conf
│   ├── frontend.Dockerfile
│   └── backend.Dockerfile
│
├── docker-compose.yml        # Docker Compose配置
├── docker-compose.dev.yml    # 开发环境配置
├── .env.example              # 环境变量示例
├── .gitignore
├── README.md
└── ARCHITECTURE.md           # 本文档
```

## 开发阶段规划

### Phase 1: 基础设施 (Week 1-2)
- [ ] 项目初始化
- [ ] Docker环境搭建
- [ ] 数据库设计与初始化
- [ ] 用户认证系统
- [ ] 基础API框架

### Phase 2: 核心功能 (Week 3-6)
- [ ] 日程管理模块
- [ ] 笔记模块
- [ ] 任务管理模块
- [ ] 数据关联功能

### Phase 3: 扩展功能 (Week 7-9)
- [ ] 财务规划模块
- [ ] 提醒系统
- [ ] 时间统计分析
- [ ] 学习工作平衡功能

### Phase 4: 优化与部署 (Week 10-12)
- [ ] 性能优化
- [ ] 测试完善
- [ ] 文档编写
- [ ] 生产环境部署

## 性能优化策略

1. **前端优化**
   - 代码分割 (Code Splitting)
   - 懒加载 (Lazy Loading)
   - 虚拟滚动 (大列表)
   - 图片懒加载与压缩
   - Service Worker (PWA可选)

2. **后端优化**
   - 数据库索引优化
   - Redis缓存热点数据
   - 批量操作优化
   - 分页查询
   - N+1查询优化

3. **部署优化**
   - CDN加速静态资源
   - Gzip/Brotli压缩
   - HTTP/2支持
   - 数据库连接池

## 可扩展性考虑

1. **微服务架构**: 未来可拆分为独立服务
2. **消息队列**: 可引入RabbitMQ/Kafka处理异步任务
3. **数据库分离**: 读写分离、分库分表
4. **负载均衡**: 多实例部署
5. **对象存储**: 文件上传可迁移至S3/OSS

## 下一步

请确认以下问题：

1. **技术栈选择**: 是否同意使用方案一（全栈TypeScript）？
2. **后端框架**: Express (简单) 还是 NestJS (企业级架构)？
3. **UI风格**: Ant Design (专业) 还是 Material-UI (现代) 还是自定义？
4. **部署目标**: 本地开发 / 云服务器 / 两者都要？
5. **优先级**: 希望先实现哪个核心模块？

确认后即可开始搭建项目！
