import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async create(userId: string, createBookingDto: CreateBookingDto) {
    return this.prisma.$transaction(async (tx) => {
      const flight = await tx.flight.findUnique({
        where: { id: createBookingDto.flightId },
      });

      if (!flight) throw new BadRequestException('Flight not found');
      // @ts-ignore
      if (flight.availableSeats <= 0) throw new BadRequestException('No seats available');

      await tx.flight.update({
        where: { id: flight.id },
        // @ts-ignore
        data: { availableSeats: { decrement: 1 } },
      });

      const booking = await tx.booking.create({
        data: {
          userId,
          flightId: createBookingDto.flightId,
          status: 'CONFIRMED',
        },
        include: { flight: true, user: true },
      });

      return booking;
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { flight: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancel(userId: string, bookingId: string) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { flight: true }
      });

      if (!booking) throw new NotFoundException('Booking not found');
      if (booking.userId !== userId) throw new UnauthorizedException('Not your booking');
      if (booking.status === 'CANCELLED') throw new BadRequestException('Already cancelled');

      await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' },
      });

      await tx.flight.update({
        where: { id: booking.flightId },
        // @ts-ignore
        data: { availableSeats: { increment: 1 } },
      });

      return { message: 'Booking cancelled successfully' };
    });
  }
}
