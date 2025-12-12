import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'UUID of the flight to book'
    })
    @IsUUID()
    @IsNotEmpty()
    flightId: string;
}
