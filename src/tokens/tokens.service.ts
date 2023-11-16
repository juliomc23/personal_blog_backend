import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class TokensService {
  constructor(private jwtService: JwtService) {}

  async generateTokens(user: User) {
    const payload = {
      _id: user._id,
      user_email: user.email,
    };
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '60s',
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  async refreshAccessToken({ refreshToken }: { refreshToken: string }) {
    try {
      const decodedJWT = this.jwtService.verify(refreshToken);
      const newPayload = {
        _id: decodedJWT._id,
        user_email: decodedJWT.user_email,
      };

      if (decodedJWT) {
        return {
          accessToken: this.jwtService.sign(newPayload, {
            expiresIn: '60s',
          }),
        };
      }
    } catch (e) {}
  }
}
