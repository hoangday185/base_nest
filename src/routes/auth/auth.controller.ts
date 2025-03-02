import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import {
  LoginDto,
  LoginResponseDto,
  RefreshTokenBodyDto,
  RegisterDto,
  RegisterResponseDto,
} from './auto.dto'
import { plainToInstance } from 'class-transformer'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto): Promise<RegisterResponseDto> {
    const result = await this.authService.register(body)
    return plainToInstance(RegisterResponseDto, result)
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return plainToInstance(LoginResponseDto, await this.authService.login(body))
  }

  @UseGuards(AccessTokenGuard)
  @Post('refresh')
  async refresh(@Body() body: RefreshTokenBodyDto) {
    return plainToInstance(
      LoginResponseDto,
      await this.authService.refresh(body),
    )
  }
}
