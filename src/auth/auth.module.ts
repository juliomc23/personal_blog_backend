import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokensModule } from 'src/tokens/tokens.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from './entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TokensModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
})
export class AuthModule {}
