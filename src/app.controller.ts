import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Inject
} from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaService } from './kafka/kafka.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';


@Controller('leads')
export class AppController {
  constructor(
    private readonly appService: AppService, 
    private readonly httpService: HttpService,
    @Inject(KafkaService) private readonly kafkaService: KafkaService, 
  ) { }

  @Get('getLeads')
  async getAllLeads() {
    try {
      console.log('Fetching all leads');
      const leads = await this.appService.getLeads();
      return {
        status: 200,
        data: leads,
        message: 'Leads retrieved successfully'
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve leads',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('createLeads')
  async createLeads(
    @Body()
    body: {
      campaignId: string;
      name: string;
      email: string;
    }
  ) {
    try {
      if (body.campaignId && body.name && body.email) {
        const lead = await this.appService.createLead(body);

        // Publish message to Kafka
        const kafkaMessage = {
          eventType: 'LEAD_CREATED',
          timestamp: new Date().toISOString(),
          data: {
            email: body.email,
            name: body.name,
            campaignId: body.campaignId,
          },
        };

        await this.kafkaService.sendMessage('lead-events', kafkaMessage);
        console.log(`Lead event published for email: ${lead.email}`);
        return {
          status: 200,
          data: lead,
          message: 'Lead created successfully'
        };
      } else {
        return {
          status: 201,
          message: 'Please provide all required fields'
        };
      }
    } catch (error) {
      if (error.code === 'P2002') { // Unique constraint violation
        throw new HttpException(
          'Email already exists',
          HttpStatus.CONFLICT
        );
      }
      throw new HttpException(
        'Failed to create lead',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('checkWord')
  async checkWordSentiment(
    @Body()
    body: {
      text: string;
    }
  ) {
    try {
      console.log('Check Word');

       const requestData = {
        text: body.text,
      };

      const response = await firstValueFrom(
        this.httpService.post('http://localhost:5000/analyze', requestData)
          .pipe(
            catchError((error) => {
              console.error('Error calling external API:', error.response?.data || error.message);
              throw new HttpException(
                'Failed to analyze text',
                HttpStatus.BAD_GATEWAY
              );
            })
          )
      );

      const analysisResult = response.data;

      return {
        status: 200,
        data: analysisResult,
        message: 'Analysis completed successfully'
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve leads',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}