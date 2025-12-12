import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'User email address'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'SecurePass123',
        description: 'User password (minimum 6 characters)',
        minLength: 6
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        example: 'John Doe',
        description: 'User full name'
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}
