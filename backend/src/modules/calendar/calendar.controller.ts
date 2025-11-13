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
import { CalendarService } from './calendar.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventsDto } from './dto/query-events.dto';
import { CalendarEvent } from './calendar.entity';

@ApiTags('calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('events')
  @ApiOperation({ summary: '创建日程事件' })
  @ApiResponse({ status: 201, description: '事件创建成功', type: CalendarEvent })
  async create(@Body() createEventDto: CreateEventDto): Promise<CalendarEvent> {
    return await this.calendarService.create(createEventDto);
  }

  @Get('events')
  @ApiOperation({ summary: '查询日程事件列表' })
  @ApiResponse({ status: 200, description: '返回事件列表', type: [CalendarEvent] })
  async findAll(@Query() queryDto: QueryEventsDto): Promise<CalendarEvent[]> {
    return await this.calendarService.findAll(queryDto);
  }

  @Get('events/upcoming')
  @ApiOperation({ summary: '获取即将到来的事件' })
  @ApiResponse({ status: 200, description: '返回未来7天的事件', type: [CalendarEvent] })
  async findUpcoming(@Query('days') days?: number): Promise<CalendarEvent[]> {
    return await this.calendarService.findUpcoming(days);
  }

  @Get('events/:id')
  @ApiOperation({ summary: '获取单个事件详情' })
  @ApiResponse({ status: 200, description: '返回事件详情', type: CalendarEvent })
  @ApiResponse({ status: 404, description: '事件不存在' })
  async findOne(@Param('id') id: string): Promise<CalendarEvent> {
    return await this.calendarService.findOne(id);
  }

  @Patch('events/:id')
  @ApiOperation({ summary: '更新事件' })
  @ApiResponse({ status: 200, description: '事件更新成功', type: CalendarEvent })
  @ApiResponse({ status: 404, description: '事件不存在' })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<CalendarEvent> {
    return await this.calendarService.update(id, updateEventDto);
  }

  @Delete('events/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除事件' })
  @ApiResponse({ status: 204, description: '事件删除成功' })
  @ApiResponse({ status: 404, description: '事件不存在' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.calendarService.remove(id);
  }
}
