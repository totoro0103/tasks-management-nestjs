import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private useRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.useRepository.signUp(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const result = await this.useRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (result === 'no user') {
      throw new UnauthorizedException('Invalid username');
    }

    if (!result) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload: JwtPayload = { username: result };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
