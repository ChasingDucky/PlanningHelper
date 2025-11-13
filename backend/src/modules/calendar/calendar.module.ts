import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { CalendarEvent } from './calendar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEvent])],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
