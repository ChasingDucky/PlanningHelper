import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('tasks')
export class Task {
  @ApiProperty({ description: '任务ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '任务标题' })
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @ApiProperty({ description: '任务描述', required: false })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: '任务状态', enum: TaskStatus })
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @ApiProperty({ description: '优先级', enum: TaskPriority })
  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @ApiProperty({ description: '进度 (0-100)', required: false })
  @Column({ type: 'int', default: 0 })
  progress: number;

  @ApiProperty({ description: '截止日期', required: false })
  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @ApiProperty({ description: '开始日期', required: false })
  @Column({ type: 'timestamp', nullable: true })
  startDate: Date;

  @ApiProperty({ description: '完成日期', required: false })
  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @ApiProperty({ description: '父任务ID', required: false })
  @Column({ type: 'uuid', nullable: true })
  parentTaskId: string;

  @ApiProperty({ description: '父任务', required: false })
  @ManyToOne(() => Task, { nullable: true })
  @JoinColumn({ name: 'parentTaskId' })
  parentTask: Task;

  @ApiProperty({ description: '标签', type: [String] })
  @Column({ type: 'jsonb', default: [] })
  tags: string[];

  @ApiProperty({ description: '关联的日程事件ID', type: [String] })
  @Column({ type: 'jsonb', default: [] })
  linkedEvents: string[];

  @ApiProperty({ description: '关联的笔记ID', type: [String] })
  @Column({ type: 'jsonb', default: [] })
  linkedNotes: string[];

  @ApiProperty({ description: '预计工时（小时）', required: false })
  @Column({ type: 'float', nullable: true })
  estimatedHours: number;

  @ApiProperty({ description: '实际工时（小时）', required: false })
  @Column({ type: 'float', nullable: true })
  actualHours: number;

  @ApiProperty({ description: '是否重要' })
  @Column({ type: 'boolean', default: false })
  isImportant: boolean;

  @ApiProperty({ description: '是否紧急' })
  @Column({ type: 'boolean', default: false })
  isUrgent: boolean;

  @ApiProperty({ description: '备注', required: false })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updatedAt: Date;
}
