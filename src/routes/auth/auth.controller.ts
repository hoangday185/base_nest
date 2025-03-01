import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto, RegisterResponseDto } from './auto.dto'
import { plainToInstance } from 'class-transformer'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto): Promise<RegisterResponseDto> {
    const result = await this.authService.register(body)
    return plainToInstance(RegisterResponseDto, result)
  }
}
