import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({ description: '完成日期', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  completedAt?: Date;

  @ApiProperty({ description: '实际工时（小时）', required: false })
  @IsNumber()
  @IsOptional()
  actualHours?: number;
}
