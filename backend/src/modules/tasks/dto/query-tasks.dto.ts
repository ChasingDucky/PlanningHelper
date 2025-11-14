import { IsOptional, IsEnum, IsBoolean, IsArray, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../tasks.entity';

export class QueryTasksDto {
  @ApiProperty({ description: '任务状态', enum: TaskStatus, required: false })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ description: '优先级', enum: TaskPriority, required: false })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({ description: '是否重要', required: false })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  isImportant?: boolean;

  @ApiProperty({ description: '是否紧急', required: false })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  isUrgent?: boolean;

  @ApiProperty({ description: '标签过滤', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: '搜索关键词', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ description: '只显示父任务（无子任务）', required: false })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  parentOnly?: boolean;
}
