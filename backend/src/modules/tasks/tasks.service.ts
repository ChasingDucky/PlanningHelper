import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Task, TaskStatus } from './tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(task);
  }

  async findAll(queryDto: QueryTasksDto): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task');

    // Parent only filter
    if (queryDto.parentOnly) {
      query.andWhere('task.parentTaskId IS NULL');
    }

    // Status filter
    if (queryDto.status) {
      query.andWhere('task.status = :status', { status: queryDto.status });
    }

    // Priority filter
    if (queryDto.priority) {
      query.andWhere('task.priority = :priority', { priority: queryDto.priority });
    }

    // Important filter
    if (queryDto.isImportant !== undefined) {
      query.andWhere('task.isImportant = :isImportant', { isImportant: queryDto.isImportant });
    }

    // Urgent filter
    if (queryDto.isUrgent !== undefined) {
      query.andWhere('task.isUrgent = :isUrgent', { isUrgent: queryDto.isUrgent });
    }

    // Tags filter
    if (queryDto.tags && queryDto.tags.length > 0) {
      query.andWhere('task.tags && :tags', { tags: queryDto.tags });
    }

    // Search filter
    if (queryDto.search) {
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search OR task.notes ILIKE :search)',
        { search: `%${queryDto.search}%` },
      );
    }

    query.orderBy('task.isImportant', 'DESC');
    query.addOrderBy('task.isUrgent', 'DESC');
    query.addOrderBy('task.dueDate', 'ASC', 'NULLS LAST');
    query.addOrderBy('task.createdAt', 'DESC');

    return await query.getMany();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async findSubTasks(parentTaskId: string): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { parentTaskId },
      order: { createdAt: 'ASC' },
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    // Auto-set completion date when status changes to completed
    if (updateTaskDto.status === TaskStatus.COMPLETED && !task.completedAt) {
      updateTaskDto.completedAt = new Date();
      if (updateTaskDto.progress === undefined) {
        updateTaskDto.progress = 100;
      }
    }

    // Clear completion date if status changes from completed
    if (
      task.status === TaskStatus.COMPLETED &&
      updateTaskDto.status &&
      updateTaskDto.status !== TaskStatus.COMPLETED
    ) {
      updateTaskDto.completedAt = null;
    }

    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);

    // Delete subtasks first
    const subTasks = await this.findSubTasks(id);
    if (subTasks.length > 0) {
      await this.taskRepository.remove(subTasks);
    }

    await this.taskRepository.remove(task);
  }

  async getStatistics(): Promise<any> {
    const total = await this.taskRepository.count();
    const completed = await this.taskRepository.count({
      where: { status: TaskStatus.COMPLETED },
    });
    const inProgress = await this.taskRepository.count({
      where: { status: TaskStatus.IN_PROGRESS },
    });
    const todo = await this.taskRepository.count({
      where: { status: TaskStatus.TODO },
    });
    const overdue = await this.taskRepository
      .createQueryBuilder('task')
      .where('task.dueDate < :now', { now: new Date() })
      .andWhere('task.status != :completed', { completed: TaskStatus.COMPLETED })
      .getCount();

    return {
      total,
      completed,
      inProgress,
      todo,
      overdue,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(2) : 0,
    };
  }

  async getUpcoming(days: number = 7): Promise<Task[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return await this.taskRepository
      .createQueryBuilder('task')
      .where('task.dueDate BETWEEN :start AND :end', {
        start: now,
        end: futureDate,
      })
      .andWhere('task.status != :completed', { completed: TaskStatus.COMPLETED })
      .orderBy('task.dueDate', 'ASC')
      .getMany();
  }
}
