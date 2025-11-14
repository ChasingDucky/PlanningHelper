import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { Task } from './tasks.entity';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: '创建任务' })
  @ApiResponse({ status: 201, description: '任务创建成功', type: Task })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: '查询任务列表' })
  @ApiResponse({ status: 200, description: '返回任务列表', type: [Task] })
  async findAll(@Query() queryDto: QueryTasksDto): Promise<Task[]> {
    return await this.tasksService.findAll(queryDto);
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取任务统计信息' })
  @ApiResponse({ status: 200, description: '返回统计数据' })
  async getStatistics(): Promise<any> {
    return await this.tasksService.getStatistics();
  }

  @Get('upcoming')
  @ApiOperation({ summary: '获取即将到期的任务' })
  @ApiResponse({ status: 200, description: '返回即将到期的任务', type: [Task] })
  async getUpcoming(@Query('days') days?: number): Promise<Task[]> {
    return await this.tasksService.getUpcoming(days);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个任务详情' })
  @ApiResponse({ status: 200, description: '返回任务详情', type: Task })
  @ApiResponse({ status: 404, description: '任务不存在' })
  async findOne(@Param('id') id: string): Promise<Task> {
    return await this.tasksService.findOne(id);
  }

  @Get(':id/subtasks')
  @ApiOperation({ summary: '获取子任务列表' })
  @ApiResponse({ status: 200, description: '返回子任务列表', type: [Task] })
  async findSubTasks(@Param('id') id: string): Promise<Task[]> {
    return await this.tasksService.findSubTasks(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新任务' })
  @ApiResponse({ status: 200, description: '任务更新成功', type: Task })
  @ApiResponse({ status: 404, description: '任务不存在' })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    return await this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除任务' })
  @ApiResponse({ status: 204, description: '任务删除成功' })
  @ApiResponse({ status: 404, description: '任务不存在' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.tasksService.remove(id);
  }
}
