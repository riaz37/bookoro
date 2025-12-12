import { Controller, Get, Post, Body, UseGuards, Request, Delete, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        flightId: '660e8400-e29b-41d4-a716-446655440001',
        userId: '770e8400-e29b-41d4-a716-446655440002',
        status: 'CONFIRMED',
        createdAt: '2025-12-12T09:30:00Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Flight not available or no seats' })
  create(@Body() createBookingDto: CreateBookingDto, @Request() req: any) {
    return this.bookingsService.create(req.user.userId, createBookingDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get all bookings for the authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'List of user bookings',
    schema: {
      example: [{
        id: '550e8400-e29b-41d4-a716-446655440000',
        flightId: '660e8400-e29b-41d4-a716-446655440001',
        userId: '770e8400-e29b-41d4-a716-446655440002',
        status: 'CONFIRMED',
        createdAt: '2025-12-12T09:30:00Z',
        flight: {
          origin: 'JFK',
          destination: 'LAX',
          departureTime: '2025-12-25T10:00:00Z',
          price: 299.99
        }
      }]
    }
  })
  findUserBookings(@Request() req: any) {
    return this.bookingsService.findAllByUser(req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled successfully',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        status: 'CANCELLED'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 403, description: 'Not authorized to cancel this booking' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.cancel(req.user.userId, id);
  }
}
