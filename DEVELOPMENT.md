# 开发指南

本文档提供 PlanningHelper 项目的详细开发指南。

## 环境要求

### 必需工具
- **Node.js**: v18 或更高版本
- **npm/pnpm**: 包管理器（推荐使用 pnpm）
- **Docker**: 用于运行数据库
- **Docker Compose**: 容器编排

### 推荐工具
- **VS Code**: 推荐的 IDE
- **PostgreSQL 客户端**: DBeaver / pgAdmin / TablePlus
- **Redis 客户端**: RedisInsight / Medis
- **API 测试**: Postman / Insomnia

## 快速开始

### 方式一：使用启动脚本（推荐）

```bash
# 启动开发环境（数据库服务）
./scripts/dev-start.sh

# 然后在两个终端窗口中分别运行：
# 终端 1 - 后端
cd backend && npm run start:dev

# 终端 2 - 前端
cd frontend && npm run dev
```

### 方式二：手动启动

#### 1. 准备环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，根据需要修改配置
```

#### 2. 启动数据库服务

```bash
docker-compose -f docker-compose.dev.yml up -d
```

#### 3. 安装依赖

```bash
# 后端依赖
cd backend
npm install

# 前端依赖
cd ../frontend
npm install
```

#### 4. 启动开发服务器

```bash
# 后端（端口 3300）
cd backend
npm run start:dev

# 前端（端口 5173）- 在新终端中运行
cd frontend
npm run dev
```

## 访问应用

- **前端应用**: http://localhost:5173
- **后端 API**: http://localhost:3300
- **API 文档**: http://localhost:3300/api/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 项目结构

```
PlanningHelper/
├── backend/                    # NestJS 后端
│   ├── src/
│   │   ├── config/            # 配置文件
│   │   ├── modules/           # 功能模块
│   │   │   └── calendar/      # 日程管理模块
│   │   │       ├── calendar.entity.ts      # 实体
│   │   │       ├── calendar.service.ts     # 服务
│   │   │       ├── calendar.controller.ts  # 控制器
│   │   │       ├── calendar.module.ts      # 模块
│   │   │       └── dto/                    # 数据传输对象
│   │   ├── common/            # 公共代码
│   │   ├── main.ts            # 入口文件
│   │   └── app.module.ts      # 根模块
│   └── package.json
│
├── frontend/                   # React 前端
│   ├── src/
│   │   ├── components/        # 组件
│   │   │   └── Layout/        # 布局组件
│   │   ├── pages/             # 页面
│   │   │   └── CalendarPage/  # 日历页面
│   │   ├── services/          # API 服务
│   │   ├── store/             # 状态管理
│   │   ├── types/             # TypeScript 类型
│   │   ├── utils/             # 工具函数
│   │   ├── styles/            # 样式文件
│   │   ├── App.tsx            # 根组件
│   │   └── main.tsx           # 入口文件
│   └── package.json
│
├── docker/                     # Docker 配置
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── nginx/
│       └── nginx.conf
│
├── scripts/                    # 工具脚本
│   ├── dev-start.sh           # 开发环境启动
│   ├── prod-start.sh          # 生产环境启动
│   └── stop.sh                # 停止服务
│
├── docker-compose.yml          # 生产环境 Docker Compose
├── docker-compose.dev.yml      # 开发环境 Docker Compose
├── .env.example                # 环境变量模板
└── README.md                   # 项目说明
```

## 开发流程

### 1. 创建新功能模块

#### 后端（NestJS）

```bash
cd backend

# 生成模块
nest g module modules/tasks
nest g controller modules/tasks
nest g service modules/tasks

# 创建实体
# 在 modules/tasks/tasks.entity.ts 中定义
```

#### 前端（React）

```bash
# 创建页面
mkdir frontend/src/pages/TasksPage
touch frontend/src/pages/TasksPage/index.tsx
touch frontend/src/pages/TasksPage/index.css

# 创建类型定义
touch frontend/src/types/tasks.ts

# 创建 API 服务
touch frontend/src/services/tasks.ts

# 创建状态管理
touch frontend/src/store/tasksStore.ts
```

### 2. 数据库操作

#### 查看数据库

```bash
# 使用 psql
docker exec -it planning-postgres-dev psql -U planning_user -d planning_helper

# 或使用 GUI 工具连接
# Host: localhost
# Port: 5432
# Database: planning_helper
# User: planning_user
# Password: planning_pass
```

#### 数据库迁移

```bash
cd backend

# 生成迁移
npm run migration:generate -- src/migrations/AddNewFeature

# 运行迁移
npm run migration:run

# 回滚迁移
npm run migration:revert
```

### 3. API 开发

#### 后端 API 开发步骤

1. **定义实体 (Entity)**
```typescript
// src/modules/tasks/tasks.entity.ts
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;
  // ...
}
```

2. **创建 DTO**
```typescript
// src/modules/tasks/dto/create-task.dto.ts
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  // ...
}
```

3. **实现 Service**
```typescript
// src/modules/tasks/tasks.service.ts
@Injectable()
export class TasksService {
  async create(dto: CreateTaskDto) {
    // 业务逻辑
  }
}
```

4. **实现 Controller**
```typescript
// src/modules/tasks/tasks.controller.ts
@Controller('tasks')
export class TasksController {
  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }
}
```

5. **在模块中注册**
```typescript
// src/modules/tasks/tasks.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
```

#### 前端 API 调用

1. **定义类型**
```typescript
// src/types/tasks.ts
export interface Task {
  id: string;
  title: string;
  // ...
}
```

2. **创建 API 服务**
```typescript
// src/services/tasks.ts
import api from './api';

export const tasksApi = {
  getTasks: (): Promise<Task[]> => api.get('/tasks'),
  // ...
};
```

3. **创建状态管理**
```typescript
// src/store/tasksStore.ts
import { create } from 'zustand';

export const useTasksStore = create((set) => ({
  tasks: [],
  fetchTasks: async () => {
    const tasks = await tasksApi.getTasks();
    set({ tasks });
  },
}));
```

4. **在组件中使用**
```typescript
// src/pages/TasksPage/index.tsx
const TasksPage = () => {
  const { tasks, fetchTasks } = useTasksStore();

  useEffect(() => {
    fetchTasks();
  }, []);

  return <div>{/* 渲染任务列表 */}</div>;
};
```

## 代码规范

### TypeScript

- 使用 TypeScript strict 模式
- 避免使用 `any` 类型
- 为函数参数和返回值添加类型注解
- 使用接口定义对象结构

### 命名约定

- **文件名**: kebab-case (例: `user-profile.ts`)
- **组件名**: PascalCase (例: `UserProfile`)
- **函数/变量**: camelCase (例: `getUserData`)
- **常量**: UPPER_SNAKE_CASE (例: `API_BASE_URL`)
- **接口/类型**: PascalCase (例: `UserProfile`)

### 提交规范

使用 Conventional Commits 格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型 (type)**:
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具配置

**示例**:
```
feat(calendar): add recurring event support

- Add repeat frequency options
- Implement repeat rule logic
- Update event form UI

Closes #123
```

## 调试

### 后端调试

#### VS Code 调试配置

创建 `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "start:debug"],
      "cwd": "${workspaceFolder}/backend",
      "console": "integratedTerminal"
    }
  ]
}
```

#### 日志调试

```typescript
// 使用 NestJS Logger
import { Logger } from '@nestjs/common';

export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);

  async create(dto: CreateEventDto) {
    this.logger.log(`Creating event: ${dto.title}`);
    // ...
  }
}
```

### 前端调试

- 使用 React DevTools 浏览器插件
- 使用 `console.log` 或 `debugger` 语句
- 在浏览器开发者工具中设置断点

## 测试

### 后端测试

```bash
cd backend

# 单元测试
npm run test

# 监听模式
npm run test:watch

# 覆盖率
npm run test:cov

# E2E 测试
npm run test:e2e
```

### 前端测试

```bash
cd frontend

# 运行测试（需要先配置测试框架）
npm run test
```

## 常见问题

### 1. 端口被占用

```bash
# 查找占用端口的进程
lsof -i :3300
lsof -i :5173

# 杀死进程
kill -9 <PID>
```

### 2. Docker 容器无法启动

```bash
# 查看日志
docker-compose logs postgres
docker-compose logs redis

# 重新创建容器
docker-compose down -v
docker-compose up -d
```

### 3. 依赖安装失败

```bash
# 清除缓存
npm cache clean --force
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 4. TypeScript 编译错误

```bash
# 清除构建缓存
rm -rf dist

# 重新构建
npm run build
```

## 性能优化

### 后端优化

1. **数据库查询优化**
   - 使用索引
   - 避免 N+1 查询
   - 使用分页

2. **缓存策略**
   - Redis 缓存热点数据
   - HTTP 缓存头

### 前端优化

1. **代码分割**
   - 路由懒加载
   - 组件懒加载

2. **资源优化**
   - 图片压缩和懒加载
   - 使用 CDN

3. **渲染优化**
   - React.memo
   - useMemo / useCallback

## 部署

### 开发环境

```bash
./scripts/dev-start.sh
```

### 生产环境

```bash
./scripts/prod-start.sh
```

### 停止服务

```bash
./scripts/stop.sh
```

## 资源链接

- [NestJS 文档](https://docs.nestjs.com/)
- [React 文档](https://react.dev/)
- [Arco Design](https://arco.design/react/docs/start)
- [TypeORM 文档](https://typeorm.io/)
- [FullCalendar 文档](https://fullcalendar.io/docs)
- [Zustand 文档](https://github.com/pmndrs/zustand)

## 获取帮助

如果遇到问题：

1. 查看项目文档
2. 查看 API 文档 (http://localhost:3300/api/docs)
3. 查看日志输出
4. 搜索相关技术文档
5. 提交 Issue
