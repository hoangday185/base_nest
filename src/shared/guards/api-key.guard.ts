import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'
import envConfig from '../config'

@Injectable()
export class APIKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()
    const apiKey = request.headers['x-api-key']
    return apiKey == envConfig.SECRET_API_KEY
  }
}
