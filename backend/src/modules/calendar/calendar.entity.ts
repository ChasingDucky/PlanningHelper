import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum EventCategory {
  WORK = 'work',
  STUDY = 'study',
  PERSONAL = 'personal',
  MEETING = 'meeting',
  DEADLINE = 'deadline',
  OTHER = 'other',
}

export enum RepeatFrequency {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Entity('calendar_events')
export class CalendarEvent {
  @ApiProperty({ description: '事件ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '事件标题' })
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @ApiProperty({ description: '事件描述', required: false })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: '开始时间' })
  @Column({ type: 'timestamp' })
  startTime: Date;

  @ApiProperty({ description: '结束时间' })
  @Column({ type: 'timestamp' })
  endTime: Date;

  @ApiProperty({ description: '是否全天事件' })
  @Column({ type: 'boolean', default: false })
  allDay: boolean;

  @ApiProperty({ description: '事件分类', enum: EventCategory })
  @Column({
    type: 'enum',
    enum: EventCategory,
    default: EventCategory.OTHER,
  })
  category: EventCategory;

  @ApiProperty({ description: '事件标签', type: [String] })
  @Column({ type: 'jsonb', default: [] })
  tags: string[];

  @ApiProperty({ description: '重复频率', enum: RepeatFrequency })
  @Column({
    type: 'enum',
    enum: RepeatFrequency,
    default: RepeatFrequency.NONE,
  })
  repeatFrequency: RepeatFrequency;

  @ApiProperty({ description: '重复规则', required: false })
  @Column({ type: 'jsonb', nullable: true })
  repeatRule: {
    endDate?: Date;
    interval?: number; // 每隔几天/周/月/年
    daysOfWeek?: number[]; // 星期几 (0-6)
    dayOfMonth?: number; // 每月的第几天
  };

  @ApiProperty({ description: '提醒设置', required: false })
  @Column({ type: 'jsonb', nullable: true })
  reminderSettings: {
    enabled: boolean;
    minutesBefore: number[]; // 提前多少分钟提醒，可多个
  };

  @ApiProperty({ description: '事件颜色' })
  @Column({ type: 'varchar', length: 7, default: '#1890ff' })
  color: string;

  @ApiProperty({ description: '事件位置', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @ApiProperty({ description: '是否已完成' })
  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @ApiProperty({ description: '关联的笔记ID', type: [String] })
  @Column({ type: 'jsonb', default: [] })
  linkedNotes: string[];

  @ApiProperty({ description: '关联的任务ID', type: [String] })
  @Column({ type: 'jsonb', default: [] })
  linkedTasks: string[];

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updatedAt: Date;
}
