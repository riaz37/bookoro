import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      return null;
    }

    if (await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signup(createUserDto: any) {
    // Check if user already exists
    const existingUser = await this.usersService.findOne(createUserDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already registered. Please login or use a different email.');
    }

    const user = await this.usersService.create(createUserDto);

    // Auto-login: Generate tokens after signup
    return this.login(user);
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, name: user.name };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.updateRefreshToken(user.id, refresh_token);

    return {
      access_token,
      refresh_token,
      user
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(userId, { refreshToken: hashedRefreshToken } as any);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    // @ts-ignore
    if (!user || !user.refreshToken) throw new UnauthorizedException('Access Denied');

    // @ts-ignore
    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!refreshTokenMatches) throw new UnauthorizedException('Access Denied');

    const payload = { email: user.email, sub: user.id, name: user.name };
    const access_token = this.jwtService.sign(payload);
    const new_refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.updateRefreshToken(user.id, new_refresh_token);

    return {
      access_token,
      refresh_token: new_refresh_token
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    const { password, ...result } = user;
    return result;
  }
}
