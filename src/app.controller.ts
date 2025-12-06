import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('leads')
export class AppController {
  constructor(private readonly appService: AppService) { }

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
}