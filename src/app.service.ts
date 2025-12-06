import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Lead } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  // Get all leads
  async getLeads(): Promise<Lead[]> {
    return this.prisma.lead.findMany();
  }

  // Create a new lead
  async createLead(data: {
    campaignId: string;
    name: string;
    email: string;
  }): Promise<Lead> {
    return this.prisma.lead.create({
      data,
    });
  }
}