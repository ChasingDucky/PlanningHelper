import { IsOptional, IsDateString, IsEnum, IsArray, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EventCategory } from '../calendar.entity';

export class QueryEventsDto {
  @ApiProperty({ description: '开始日期', required: false, example: '2024-01-01' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ description: '结束日期', required: false, example: '2024-01-31' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ description: '事件分类', enum: EventCategory, required: false })
  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @ApiProperty({ description: '标签过滤', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: '搜索关键词', required: false })
  @IsString()
  @IsOptional()
  search?: string;
}
