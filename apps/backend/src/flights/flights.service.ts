import { Injectable } from '@nestjs/common';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FlightsService {
  constructor(private prisma: PrismaService) { }

  create(createFlightDto: CreateFlightDto) {
    return this.prisma.flight.create({
      data: {
        ...createFlightDto,
        availableSeats: createFlightDto.seats, // Initialize available seats
      },
    });
  }

  async findAll(params: {
    origin?: string;
    destination?: string;
    date?: string;
    minPrice?: number;
    maxPrice?: number;
  }) {
    const { origin, destination, date, minPrice, maxPrice } = params;
    const where: any = {};

    if (origin) where.origin = { contains: origin, mode: 'insensitive' };
    if (destination) where.destination = { contains: destination, mode: 'insensitive' };

    if (date) {
      const searchDate = new Date(date);
      const nextDate = new Date(searchDate);
      nextDate.setDate(nextDate.getDate() + 1);

      where.departureTime = {
        gte: searchDate,
        lt: nextDate,
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }

    return this.prisma.flight.findMany({ where });
  }

  findOne(id: string) {
    return this.prisma.flight.findUnique({ where: { id } });
  }

  update(id: number, updateFlightDto: UpdateFlightDto) {
    return `This action updates a #${id} flight`;
  }

  remove(id: number) {
    return `This action removes a #${id} flight`;
  }
}
