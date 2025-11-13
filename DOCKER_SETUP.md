# Docker 启动指南

## 问题：Docker daemon 未运行

如果看到错误：
```
Cannot connect to the Docker daemon at unix:///Users/zack/.docker/run/docker.sock.
Is the docker daemon running?
```

## 解决方法

### macOS 用户

1. **打开 Docker Desktop 应用**
   - 在 Launchpad 或应用程序文件夹中找到 "Docker" 图标
   - 双击打开 Docker Desktop
   - 等待 Docker 图标出现在顶部菜单栏，并显示为运行状态（不是红色）

2. **检查 Docker 状态**
   ```bash
   docker info
   ```

   如果成功，会显示 Docker 的配置信息

3. **如果 Docker Desktop 未安装**
   - 前往 https://www.docker.com/products/docker-desktop
   - 下载并安装 Docker Desktop for Mac
   - 安装完成后启动 Docker Desktop

### Windows 用户

1. **打开 Docker Desktop**
   - 从开始菜单启动 "Docker Desktop"
   - 等待 Docker 引擎启动完成

2. **检查 WSL 2** (Windows 用户)
   - Docker Desktop on Windows 需要 WSL 2
   - 确保 WSL 2 已正确安装和配置

## 启动项目

Docker 启动后，按照以下步骤：

### 方式一：开发环境（推荐）

```bash
# 1. 创建 .env 文件
cp .env.example .env

# 2. 只启动数据库服务
docker-compose -f docker-compose.dev.yml up -d

# 3. 等待数据库启动完成（约5-10秒）
docker-compose -f docker-compose.dev.yml ps

# 4. 安装并启动后端（新终端）
cd backend
npm install
npm run start:dev

# 5. 安装并启动前端（另一个新终端）
cd frontend
npm install
npm run dev
```

### 方式二：生产环境（完整 Docker）

```bash
# 1. 创建 .env 文件
cp .env.example .env

# 2. 启动所有服务
docker-compose up -d

# 3. 查看日志
docker-compose logs -f

# 4. 检查服务状态
docker-compose ps
```

## 访问地址

**开发环境：**
- 前端: http://localhost:5173
- 后端: http://localhost:3300
- API 文档: http://localhost:3300/api/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379

**生产环境（Docker）：**
- 应用: http://localhost
- 后端 API: http://localhost/api
- API 文档: http://localhost/api/docs

## 常用 Docker 命令

### 查看服务状态
```bash
# 开发环境
docker-compose -f docker-compose.dev.yml ps

# 生产环境
docker-compose ps
```

### 查看日志
```bash
# 所有服务
docker-compose logs -f

# 特定服务
docker-compose logs -f postgres
docker-compose logs -f redis
```

### 停止服务
```bash
# 开发环境
docker-compose -f docker-compose.dev.yml down

# 生产环境
docker-compose down

# 删除数据卷（慎用！会删除所有数据）
docker-compose down -v
```

### 重启服务
```bash
# 重启特定服务
docker-compose restart postgres

# 重启所有服务
docker-compose restart
```

### 进入容器
```bash
# 进入 PostgreSQL
docker exec -it planning-postgres-dev psql -U planning_user -d planning_helper

# 进入 Redis
docker exec -it planning-redis-dev redis-cli
```

## 故障排除

### 1. 端口被占用

如果端口 3300、5173、5432 或 6379 被占用：

**macOS/Linux:**
```bash
# 查找占用端口的进程
lsof -i :3300
lsof -i :5173
lsof -i :5432
lsof -i :6379

# 终止进程
kill -9 <PID>
```

**Windows:**
```powershell
# 查找占用端口的进程
netstat -ano | findstr :3300

# 终止进程
taskkill /PID <PID> /F
```

### 2. 数据库连接失败

```bash
# 检查数据库容器是否运行
docker ps | grep postgres

# 查看数据库日志
docker logs planning-postgres-dev

# 重启数据库
docker-compose -f docker-compose.dev.yml restart postgres
```

### 3. 容器无法启动

```bash
# 查看详细错误
docker-compose -f docker-compose.dev.yml logs

# 完全清理并重启
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

### 4. Docker Desktop 卡住

**macOS:**
- 退出 Docker Desktop
- 重新启动 Docker Desktop
- 如果还是无法启动，尝试重启电脑

**Windows:**
- 右键 Docker Desktop 托盘图标
- 选择 "Restart"
- 如果无效，尝试 "Quit Docker Desktop" 后重新打开

### 5. 磁盘空间不足

```bash
# 清理未使用的镜像
docker image prune -a

# 清理未使用的容器
docker container prune

# 清理未使用的数据卷
docker volume prune

# 全面清理（慎用）
docker system prune -a --volumes
```

## 性能优化

### macOS 用户

在 Docker Desktop 设置中：
1. Resources → Advanced
2. 调整 CPU 和内存分配
   - CPUs: 建议 4 核
   - Memory: 建议 4GB+

### Windows 用户

1. 确保使用 WSL 2 后端
2. 在 Docker Desktop 中调整资源分配

## 数据持久化

数据存储在 Docker volumes 中：
- `postgres_data` 或 `postgres_dev_data`: PostgreSQL 数据
- `redis_data` 或 `redis_dev_data`: Redis 数据

即使容器被删除，数据仍然保留。只有使用 `docker-compose down -v` 才会删除数据。

## 备份数据

### 备份 PostgreSQL

```bash
# 导出数据
docker exec planning-postgres-dev pg_dump -U planning_user planning_helper > backup.sql

# 恢复数据
docker exec -i planning-postgres-dev psql -U planning_user planning_helper < backup.sql
```

### 备份 Redis

```bash
# Redis 数据会自动保存到 dump.rdb
docker exec planning-redis-dev redis-cli SAVE
```

## 使用脚本启动

我们提供了便捷的启动脚本：

```bash
# 开发环境
./scripts/dev-start.sh

# 生产环境
./scripts/prod-start.sh

# 停止所有服务
./scripts/stop.sh
```

## 需要帮助？

如果遇到其他问题：
1. 查看 [开发指南](DEVELOPMENT.md)
2. 查看 [快速开始](GETTING_STARTED.md)
3. 提交 Issue
