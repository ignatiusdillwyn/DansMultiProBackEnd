import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class LeadWorkerService implements OnModuleInit {
  constructor(private readonly kafkaService: KafkaService) {}

  async onModuleInit() {
    await this.kafkaService.subscribeToTopic(
      'lead-events',
      this.handleLeadEvent.bind(this),
    );
    console.log('Lead worker started and subscribed to lead-events topic');
  }

  private handleLeadEvent(message: any) {
    if (message.eventType === 'LEAD_CREATED') {
      const email = message.data.email;
      console.log(`Lead received: ${email}`);
      
      // Di sini Anda bisa menambahkan logika tambahan
      // seperti menyimpan ke database lain, mengirim email, dll.
    }
  }
}