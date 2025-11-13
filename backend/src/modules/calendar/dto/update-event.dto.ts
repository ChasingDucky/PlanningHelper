import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @ApiProperty({ description: '是否已完成', required: false })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
