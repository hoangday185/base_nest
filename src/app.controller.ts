import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import envConfig from './shared/config'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log(envConfig.ACCESS_TOKEN_EXPIRATION)
    return this.appService.getHello()
  }
}
