import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Summary, SummarySchema } from './schema/summary.schema';
import { SummariesService } from './summary.service';
import { SummariesController } from './summary.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Summary.name, schema: SummarySchema }])],
  providers: [SummariesService],
  controllers: [SummariesController],
  exports: [SummariesService, MongooseModule],
})
export class SummariesModule {}
