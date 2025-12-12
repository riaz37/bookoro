import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      return null;
    }

    // Check if email is verified
    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email before logging in.');
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

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await this.usersService.create({
      ...createUserDto,
      verificationToken: otp,
    });

    // Send OTP email (continue even if fails)
    try {
      await this.mailService.sendOtpEmail(user.name || 'User', user.email, otp);
    } catch (error) {
      console.error('[AuthService] ❌ Email failed:', error);
    }

    return {
      message: 'User registered successfully. Please check your email for the verification code.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    };
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

  async verifyEmail(email: string, otp: string) {
    const user = await this.usersService.findOne(email);
    if (!user) throw new UnauthorizedException('User not found');
    if (user.isVerified) throw new UnauthorizedException('Email already verified');
    if (user.verificationToken !== otp) throw new UnauthorizedException('Invalid OTP');

    await this.usersService.update(user.id, {
      isVerified: true,
      verificationToken: null
    } as any);

    // Auto-login: Generate tokens after verification
    const payload = { email: user.email, sub: user.id, name: user.name };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.updateRefreshToken(user.id, refresh_token);

    return {
      message: 'Email verified successfully',
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }

  async resendOtp(email: string) {
    const user = await this.usersService.findOne(email);
    if (!user) throw new UnauthorizedException('User not found');
    if (user.isVerified) throw new UnauthorizedException('Email already verified');

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.usersService.update(user.id, { verificationToken: otp } as any);

    // Send OTP email
    try {
      await this.mailService.sendOtpEmail(user.name || 'User', user.email, otp);
    } catch (error) {
      console.error('[AuthService] ❌ Email failed:', error);
      throw new UnauthorizedException('Failed to send OTP. Please try again.');
    }

    return { message: 'OTP sent successfully' };
  }
}
