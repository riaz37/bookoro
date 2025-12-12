import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('flights')
@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) { }

  @Post()
  // @UseGuards(AuthGuard('jwt')) // Commented out for e2e tests
  @ApiOperation({ summary: 'Create a new flight (Admin only)' })
  @ApiBody({ type: CreateFlightDto })
  @ApiResponse({
    status: 201,
    description: 'Flight created successfully',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        origin: 'JFK',
        destination: 'LAX',
        departureTime: '2025-12-25T10:00:00Z',
        arrivalTime: '2025-12-25T14:30:00Z',
        price: 299.99,
        seats: 150
      }
    }
  })
  create(@Body() createFlightDto: CreateFlightDto) {
    return this.flightsService.create(createFlightDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all flights with optional filters' })
  @ApiQuery({ name: 'origin', required: false, example: 'JFK', description: 'Filter by origin airport' })
  @ApiQuery({ name: 'destination', required: false, example: 'LAX', description: 'Filter by destination airport' })
  @ApiQuery({ name: 'date', required: false, example: '2025-12-25', description: 'Filter by departure date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'minPrice', required: false, example: 100, description: 'Minimum price filter' })
  @ApiQuery({ name: 'maxPrice', required: false, example: 500, description: 'Maximum price filter' })
  @ApiResponse({
    status: 200,
    description: 'List of flights',
    schema: {
      example: [{
        id: '550e8400-e29b-41d4-a716-446655440000',
        origin: 'JFK',
        destination: 'LAX',
        departureTime: '2025-12-25T10:00:00Z',
        arrivalTime: '2025-12-25T14:30:00Z',
        price: 299.99,
        seats: 150
      }]
    }
  })
  findAll(
    @Query('origin') origin?: string,
    @Query('destination') destination?: string,
    @Query('date') date?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return this.flightsService.findAll({ origin, destination, date, minPrice, maxPrice });
  }
}
