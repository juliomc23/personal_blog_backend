/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { TokensService } from './tokens.service';
@Controller('token')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Post('refresh')
  login(@Body() refreshToken: { refreshToken: string }) {
    return this.tokensService.refreshAccessToken(refreshToken);
  }
}
