# 快速开始指南

欢迎使用 PlanningHelper！本指南将帮助你在 5 分钟内启动项目。

## 📋 前置要求

确保你的电脑上已安装：

- ✅ **Node.js** (v18+) - [下载链接](https://nodejs.org/)
- ✅ **Docker Desktop** - [下载链接](https://www.docker.com/products/docker-desktop)
- ✅ **Git** - [下载链接](https://git-scm.com/)

## 🚀 三步启动

### 步骤 1: 克隆项目

```bash
git clone <repository-url>
cd PlanningHelper
```

### 步骤 2: 启动数据库

```bash
# 复制环境变量文件
cp .env.example .env

# 启动 PostgreSQL 和 Redis
docker-compose -f docker-compose.dev.yml up -d
```

### 步骤 3: 启动应用

打开两个终端窗口：

**终端 1 - 启动后端:**
```bash
cd backend
npm install
npm run start:dev
```

**终端 2 - 启动前端:**
```bash
cd frontend
npm install
npm run dev
```

## 🎉 完成！

现在你可以访问应用了：

- 🌐 **前端界面**: http://localhost:5173
- 🔌 **后端 API**: http://localhost:3300
- 📚 **API 文档**: http://localhost:3300/api/docs

## 📱 功能演示

### 创建你的第一个日程事件

1. 打开浏览器访问 http://localhost:5173
2. 点击左侧菜单"日程管理"
3. 点击右上角"新建事件"按钮
4. 填写事件信息：
   - 标题: 例如 "团队会议"
   - 开始时间和结束时间
   - 分类、地点等其他信息
5. 点击"创建"
6. 你的事件会立即显示在日历上！

### 日历视图切换

- **月视图**: 查看整月的事件安排
- **周视图**: 详细的周计划
- **日视图**: 按小时查看当天日程
- **列表视图**: 以列表形式查看所有事件

### 编辑和删除事件

- 点击日历上的任何事件可以查看详情
- 点击后可以编辑或删除事件

## 🛠️ 使用脚本启动（可选）

我们提供了启动脚本让启动更简单：

```bash
# 自动启动数据库并安装依赖
./scripts/dev-start.sh

# 然后按照提示在两个终端中分别启动后端和前端
```

## 🐳 使用 Docker 启动（生产环境）

如果想以生产模式运行整个应用：

```bash
# 构建并启动所有服务
docker-compose up -d

# 访问应用
# 前端: http://localhost
```

## 📖 下一步

- 📘 阅读 [开发指南](DEVELOPMENT.md) 了解如何开发新功能
- 🏗️ 查看 [架构设计](ARCHITECTURE.md) 了解项目架构
- 🔍 浏览 [API 文档](http://localhost:3300/api/docs) 了解后端接口

## ❓ 遇到问题？

### 常见问题

**问题 1: Docker 启动失败**
```bash
# 检查 Docker 是否运行
docker info

# 重启 Docker Desktop
```

**问题 2: 端口被占用**
```bash
# 检查端口占用
lsof -i :3300  # 后端端口
lsof -i :5173  # 前端端口
lsof -i :5432  # PostgreSQL 端口

# 修改 .env 文件中的端口配置
```

**问题 3: npm install 失败**
```bash
# 清除缓存重试
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**问题 4: 数据库连接失败**
```bash
# 检查数据库是否运行
docker ps | grep postgres

# 查看数据库日志
docker logs planning-postgres-dev

# 重启数据库
docker-compose -f docker-compose.dev.yml restart postgres
```

### 停止服务

```bash
# 停止后端和前端
# 在各自的终端按 Ctrl+C

# 停止数据库
docker-compose -f docker-compose.dev.yml down

# 或使用脚本
./scripts/stop.sh
```

## 💡 小贴士

1. **热重载**: 修改代码后，前端和后端都会自动重启
2. **API 文档**: 访问 http://localhost:3300/api/docs 可以直接测试 API
3. **数据持久化**: 数据会保存在 Docker volume 中，重启不会丢失
4. **开发工具**: 推荐安装 React DevTools 和 Redux DevTools 浏览器插件

## 🎯 核心功能

当前版本已实现：

- ✅ 日程管理（创建、编辑、删除、查看）
- ✅ 多种日历视图（月/周/日/列表）
- ✅ 事件分类和标签
- ✅ 事件搜索和筛选
- ✅ 响应式设计

即将推出：

- ⏳ 任务管理
- ⏳ 笔记功能
- ⏳ 财务规划
- ⏳ 提醒通知
- ⏳ 数据统计分析
- ⏳ 用户认证

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

祝你使用愉快！如有问题欢迎反馈。
