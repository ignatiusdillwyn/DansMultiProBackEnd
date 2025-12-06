import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'lead-service',
      brokers: ['localhost:9092'], // Ganti dengan broker Kafka Anda
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'lead-consumer-group' });
  }

  async onModuleInit() {
    await this.producer.connect();
    console.log('Kafka Producer connected');
    
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    console.log('Kafka Producer disconnected');
  }

  async sendMessage(topic: string, message: any) {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            value: JSON.stringify(message),
          },
        ],
      });
      console.log(`Message sent to topic ${topic}:`, message);
    } catch (error) {
      console.error('Error sending message to Kafka:', error);
      throw error;
    }
  }

  // Method untuk worker service
  async subscribeToTopic(topic: string, callback: (message: any) => void) {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();
        if (value) {
          callback(JSON.parse(value));
        }
      },
    });
  }
}