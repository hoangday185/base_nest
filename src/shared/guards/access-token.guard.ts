import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { TokenService } from '../services/token.service'
import envConfig from '../config'
import { REQUEST_USER_KEY } from '../constants/auth.constants'

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()

    const token = request.headers.authorization?.split(' ')[1]
    if (!token) {
      return false
    }

    try {
      const decoded = this.tokenService.verifyToken(
        token,
        envConfig.ACCESS_TOKEN_SECRET,
      )

      request[REQUEST_USER_KEY] = decoded
      return true
    } catch {
      throw new UnauthorizedException('Invalid access token')
    }
  }
}
