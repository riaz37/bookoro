import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT refresh token'
    })
    @IsString()
    @IsNotEmpty()
    refreshToken: string;

    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'User UUID'
    })
    @IsString()
    @IsNotEmpty()
    userId: string;
}
