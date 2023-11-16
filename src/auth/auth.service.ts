import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { TokensService } from 'src/tokens/tokens.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private tokensService: TokensService,
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
      return await this.tokensService.generateTokens(user);
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
      return await this.tokensService.generateTokens(userCreated);
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
}
