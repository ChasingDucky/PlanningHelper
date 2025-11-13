# PlanningHelper - 个人日程管理系统

一个功能丰富的个人管理系统，集成日程管理、笔记、任务、财务规划等功能。

## 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI库**: Arco Design（字节跳动）
- **状态管理**: Zustand
- **路由**: React Router v6
- **日历组件**: FullCalendar
- **样式**: TailwindCSS

### 后端
- **框架**: NestJS + TypeScript
- **数据库**: PostgreSQL 16
- **缓存**: Redis 7
- **ORM**: TypeORM
- **API**: RESTful

### DevOps
- **容器化**: Docker + Docker Compose
- **反向代理**: Nginx

## 核心功能模块

- 📅 **日程管理**: 日历视图、事件管理、重复事件
- 📝 **笔记系统**: 快速记录、Markdown支持、标签管理
- ✅ **任务管理**: 待办清单、优先级、进度跟踪
- 💰 **财务规划**: 收支记录、预算管理、报表分析
- 🔔 **提醒系统**: 多种提醒方式、重要事项突出
- 📊 **学习工作平衡**: 时间统计、番茄钟、效率分析

## 快速开始

### 前置要求

- Node.js 18+
- Docker & Docker Compose
- pnpm (推荐) / npm / yarn

### 开发环境

1. **克隆项目**
```bash
git clone <repository-url>
cd PlanningHelper
```

2. **环境变量配置**
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库等信息
```

3. **启动 Docker 服务**
```bash
docker-compose up -d postgres redis
```

4. **安装依赖**
```bash
# 后端
cd backend
pnpm install

# 前端
cd ../frontend
pnpm install
```

5. **启动开发服务器**
```bash
# 后端 (终端1)
cd backend
pnpm run start:dev

# 前端 (终端2)
cd frontend
pnpm run dev
```

6. **访问应用**
- 前端: http://localhost:5173
- 后端API: http://localhost:3300
- API文档: http://localhost:3300/api/docs

### 使用 Docker Compose 启动（推荐）

```bash
# 开发环境
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# 生产环境
docker-compose up -d
```

## 项目结构

```
PlanningHelper/
├── frontend/           # React 前端应用
├── backend/            # NestJS 后端应用
├── shared/             # 前后端共享代码
├── docker/             # Docker 配置文件
├── docker-compose.yml  # Docker Compose 配置
└── ARCHITECTURE.md     # 架构设计文档
```

## 开发指南

### 代码规范
- ESLint + Prettier
- 提交前自动格式化
- TypeScript strict 模式

### 分支策略
- `main`: 生产环境
- `develop`: 开发环境
- `feature/*`: 功能分支
- `bugfix/*`: 修复分支

### API 文档
访问 `http://localhost:3300/api/docs` 查看 Swagger API 文档

## 部署

### Docker 生产部署

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 环境变量

参考 `.env.example` 文件配置以下环境变量：
- 数据库连接
- Redis 连接
- JWT 密钥
- 端口配置

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 联系方式

- 项目地址: [GitHub Repository]
- 问题反馈: [Issues]
