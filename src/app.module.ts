// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { KafkaModule } from './kafka/kafka.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [KafkaModule,HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
  }),],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}