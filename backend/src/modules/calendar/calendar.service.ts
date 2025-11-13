import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, In } from 'typeorm';
import { CalendarEvent } from './calendar.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryEventsDto } from './dto/query-events.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEvent)
    private readonly eventRepository: Repository<CalendarEvent>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<CalendarEvent> {
    const event = this.eventRepository.create(createEventDto);
    return await this.eventRepository.save(event);
  }

  async findAll(queryDto: QueryEventsDto): Promise<CalendarEvent[]> {
    const query = this.eventRepository.createQueryBuilder('event');

    // Date range filter
    if (queryDto.startDate && queryDto.endDate) {
      query.andWhere('event.startTime BETWEEN :startDate AND :endDate', {
        startDate: new Date(queryDto.startDate),
        endDate: new Date(queryDto.endDate),
      });
    }

    // Category filter
    if (queryDto.category) {
      query.andWhere('event.category = :category', { category: queryDto.category });
    }

    // Tags filter
    if (queryDto.tags && queryDto.tags.length > 0) {
      query.andWhere('event.tags && :tags', { tags: queryDto.tags });
    }

    // Search filter
    if (queryDto.search) {
      query.andWhere(
        '(event.title ILIKE :search OR event.description ILIKE :search OR event.location ILIKE :search)',
        { search: `%${queryDto.search}%` },
      );
    }

    query.orderBy('event.startTime', 'ASC');

    return await query.getMany();
  }

  async findOne(id: string): Promise<CalendarEvent> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<CalendarEvent> {
    const event = await this.findOne(id);
    Object.assign(event, updateEventDto);
    return await this.eventRepository.save(event);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.eventRepository.remove(event);
  }

  async findUpcoming(days: number = 7): Promise<CalendarEvent[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return await this.eventRepository.find({
      where: {
        startTime: Between(now, futureDate),
        completed: false,
      },
      order: {
        startTime: 'ASC',
      },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    return await this.eventRepository.find({
      where: {
        startTime: Between(startDate, endDate),
      },
      order: {
        startTime: 'ASC',
      },
    });
  }
}
