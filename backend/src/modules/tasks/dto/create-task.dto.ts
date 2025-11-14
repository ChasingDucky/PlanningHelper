import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsDate,
  IsBoolean,
  IsArray,
  IsNumber,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../tasks.entity';

export class CreateTaskDto {
  @ApiProperty({ description: '任务标题', example: '完成项目文档' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '任务描述', required: false, example: '编写技术文档和用户手册' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '任务状态', enum: TaskStatus, default: TaskStatus.TODO })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ description: '优先级', enum: TaskPriority, default: TaskPriority.MEDIUM })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({ description: '进度 (0-100)', required: false, example: 0 })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress?: number;

  @ApiProperty({ description: '截止日期', required: false, example: '2024-12-31T23:59:59Z' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ description: '开始日期', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({ description: '父任务ID', required: false })
  @IsUUID()
  @IsOptional()
  parentTaskId?: string;

  @ApiProperty({ description: '标签', type: [String], required: false, example: ['工作', '紧急'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: '关联的日程事件ID', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  linkedEvents?: string[];

  @ApiProperty({ description: '预计工时（小时）', required: false, example: 8 })
  @IsNumber()
  @IsOptional()
  estimatedHours?: number;

  @ApiProperty({ description: '是否重要', default: false })
  @IsBoolean()
  @IsOptional()
  isImportant?: boolean;

  @ApiProperty({ description: '是否紧急', default: false })
  @IsBoolean()
  @IsOptional()
  isUrgent?: boolean;

  @ApiProperty({ description: '备注', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
