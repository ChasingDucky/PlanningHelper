import { IsString, IsNotEmpty, IsDate, IsBoolean, IsOptional, IsEnum, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EventCategory, RepeatFrequency } from '../calendar.entity';

export class CreateEventDto {
  @ApiProperty({ description: '事件标题', example: '团队会议' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '事件描述', required: false, example: '讨论Q1季度规划' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '开始时间', example: '2024-01-15T10:00:00Z' })
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @ApiProperty({ description: '结束时间', example: '2024-01-15T11:00:00Z' })
  @Type(() => Date)
  @IsDate()
  endTime: Date;

  @ApiProperty({ description: '是否全天事件', default: false })
  @IsBoolean()
  @IsOptional()
  allDay?: boolean;

  @ApiProperty({ description: '事件分类', enum: EventCategory, default: EventCategory.OTHER })
  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @ApiProperty({ description: '事件标签', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: '重复频率', enum: RepeatFrequency, default: RepeatFrequency.NONE })
  @IsEnum(RepeatFrequency)
  @IsOptional()
  repeatFrequency?: RepeatFrequency;

  @ApiProperty({ description: '重复规则', required: false })
  @IsOptional()
  repeatRule?: {
    endDate?: Date;
    interval?: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
  };

  @ApiProperty({ description: '提醒设置', required: false })
  @IsOptional()
  reminderSettings?: {
    enabled: boolean;
    minutesBefore: number[];
  };

  @ApiProperty({ description: '事件颜色', example: '#1890ff', default: '#1890ff' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ description: '事件位置', required: false, example: '会议室A' })
  @IsString()
  @IsOptional()
  location?: string;
}
