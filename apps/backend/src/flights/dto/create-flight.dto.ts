import { IsDateString, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFlightDto {
    @ApiProperty({
        example: 'JFK',
        description: 'Flight origin airport code'
    })
    @IsString()
    @IsNotEmpty()
    origin: string;

    @ApiProperty({
        example: 'LAX',
        description: 'Flight destination airport code'
    })
    @IsString()
    @IsNotEmpty()
    destination: string;

    @ApiProperty({
        example: '2025-12-25T10:00:00Z',
        description: 'Flight departure time (ISO 8601 format)'
    })
    @IsDateString()
    departureTime: string;

    @ApiProperty({
        example: '2025-12-25T14:30:00Z',
        description: 'Flight arrival time (ISO 8601 format)'
    })
    @IsDateString()
    arrivalTime: string;

    @ApiProperty({
        example: 299.99,
        description: 'Flight ticket price in USD',
        minimum: 0
    })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({
        example: 150,
        description: 'Total number of seats available',
        minimum: 1
    })
    @IsNumber()
    @Min(1)
    seats: number;
}
