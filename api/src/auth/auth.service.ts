import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './entities/refresh-token.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupData: SignupDto) {
    const { userName, password, avatar } = signupData;

    const userNameInUse = await this.userRepository.findOne({
      where: {
        userName,
      },
    });

    if (userNameInUse) {
      throw new BadRequestException('Username already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      userName,
      password: hashedPassword,
      avatar,
    });

    await this.userRepository.save(newUser);
  }

  async login(loginData: LoginDto) {
    const { userName, password } = loginData;

    const existingUser = await this.userRepository.findOne({
      where: {
        userName,
      },
    });

    if (!existingUser) {
      throw new UnauthorizedException('Bad credentials');
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Bad credentials');
    }

    const tokens = await this.generateTokens(
      existingUser.id,
      existingUser.userName,
    );

    return {
      ...tokens,
      user: {
        userId: existingUser.id,
        userName: existingUser.userName,
        avatar: existingUser.avatar,
      },
    };
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.refreshTokenRepository.findOne({
      where: {
        token: refreshToken,
        expiresAt: MoreThanOrEqual(new Date()),
      },
      relations: ['user'],
    });

    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.generateTokens(token.user.id, token.user.userName);
  }

  private async generateTokens(userId: string, userName: string) {
    const accessToken = this.jwtService.sign(
      { userId, userName },
      { expiresIn: '1m' },
    );
    const refreshToken = uuidv4();

    await this.storeRefreshToken(refreshToken, userId);
    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(token: string, userId: string) {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    let refreshToken = await this.refreshTokenRepository.findOne({
      where: { user: { id: userId } },
    });

    if (refreshToken) {
      refreshToken.token = token;
      refreshToken.expiresAt = expiryDate;
    } else {
      refreshToken = this.refreshTokenRepository.create({
        token,
        user: { id: userId },
        expiresAt: expiryDate,
      });
    }

    return this.refreshTokenRepository.save(refreshToken);
  }
}
