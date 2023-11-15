import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { SignUpDto } from './dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async loginUser(loginDto: LoginDto) {
    const user = await this.findOneByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Email or password are incorrect');
    }

    const isPasswordValid = await this.comparePasswords(
      loginDto.password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password are incorrect');
    }

    if (user && isPasswordValid) {
      const access_token = await this.generateAccessToken(user);
      const refresh_token = await this.generateRefreshToken(user);
      return { access_token, refresh_token };
    }
  }

  async signUpUser(signUpDto: SignUpDto) {
    const user = await this.findOneByEmail(signUpDto.email);
    if (user) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.hashPassword(signUpDto.password);
    const signUpDtoWithHashedPassword = {
      ...signUpDto,
      password: hashedPassword,
    };

    const userCreated = await this.userModel.create(
      signUpDtoWithHashedPassword,
    );

    if (userCreated) {
      const access_token = await this.generateAccessToken(userCreated);
      const refresh_token = await this.generateRefreshToken(userCreated);
      return { access_token, refresh_token };
    }
  }

  private async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    return user;
  }

  private async comparePasswords(formPassword: string, storedPassword: string) {
    const isPasswordValid = await bcrypt.compare(formPassword, storedPassword);
    return isPasswordValid;
  }

  private async hashPassword(password: string) {
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(this.configService.get('SALT_OR_ROUNDS')),
    );

    return hashedPassword;
  }

  private async generateAccessToken(user: User) {
    const payload = {
      sub: user._id,
      username: user.name,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_JWT_SECRET'),
      expiresIn: '2h',
    });
  }

  private async generateRefreshToken(user: any): Promise<string> {
    const payload = {
      sub: user._id,
      username: user.name,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_JWT_SECRET'),
      expiresIn: '7d',
    });
  }
}
