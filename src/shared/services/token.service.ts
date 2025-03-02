import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import envConfig from '../config'
import { JwtPayload } from '../types/jwt.type'
@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signAccessToken(payload: { userId: number; uuid: string }): string {
    return this.jwtService.sign(payload, {
      algorithm: 'HS256',
      secret: envConfig.ACCESS_TOKEN_SECRET,
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRATION,
    })
  }

  signRefreshToken(payload: { userId: number; uuid: string }): string {
    return this.jwtService.sign(payload, {
      algorithm: 'HS256',
      secret: envConfig.REFRESH_TOKEN_SECRET,
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRATION,
    })
  }

  verifyToken(token: string, secret: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token, {
      secret,
    })
  }
}
