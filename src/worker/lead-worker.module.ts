import { Module } from '@nestjs/common';
import { LeadWorkerService } from './lead-worker.service';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  providers: [LeadWorkerService],
})
export class LeadWorkerModule {}