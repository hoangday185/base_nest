import { HashingService } from './../../shared/services/hashing.service'
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { LoginDto, RefreshTokenBodyDto, RegisterDto } from './auto.dto'
import { v4 as uuidv4 } from 'uuid'
import { TokenService } from 'src/shared/services/token.service'
import envConfig from 'src/shared/config'
import { isNotFoundError, isUniqueErrorConstant } from 'src/shared/helpers'
@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: RegisterDto) {
    try {
      const hashedPassword = await this.hashingService.hash(body.password)
      const user = await this.prismaService.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name,
        },
      })
      return user
    } catch (error) {
      if (isUniqueErrorConstant(error)) {
        console.log(error)
        throw new ConflictException('Email already exists')
      }
      throw error
    }
  }

  async login(body: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    })
    if (!user) {
      throw new UnauthorizedException('User not found')
    }
    const isPasswordValid = await this.hashingService.compare(
      body.password,
      user.password,
    )
    if (!isPasswordValid) {
      throw new UnprocessableEntityException([
        {
          field: 'Password',
          message: 'Password is incorrect',
        },
      ])
    }
    const token = await this.generateToken(user.id)

    const decodedRefreshToken = await this.tokenService.verifyToken(
      token.refreshToken,
      envConfig.REFRESH_TOKEN_SECRET,
    )
    await this.prismaService.refreshToken.create({
      data: {
        userId: user.id,
        hashToken: decodedRefreshToken.uuid,
        token: token.refreshToken,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
        createdAt: new Date(decodedRefreshToken.iat * 1000),
      },
    })
    return token
  }

  private async generateToken(userId: number) {
    const payload = { userId, uuid: uuidv4() }
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ])
    return { accessToken, refreshToken }
  }

  async refresh(body: RefreshTokenBodyDto) {
    try {
      const decodedRefreshToken = await this.tokenService.verifyToken(
        body.refreshToken,
        envConfig.REFRESH_TOKEN_SECRET,
      )
      const refreshTokenEntity =
        await this.prismaService.refreshToken.findFirst({
          where: {
            hashToken: decodedRefreshToken.uuid,
          },
        })
      if (!refreshTokenEntity) {
        throw new UnauthorizedException('Invalid refresh token')
      }
      const user = await this.prismaService.user.findUnique({
        where: {
          id: refreshTokenEntity.userId,
        },
      })
      if (!user) {
        throw new UnauthorizedException('User not found')
      }
      const token = await this.generateToken(user.id)
      const newDecodedRefreshToken = await this.tokenService.verifyToken(
        token.refreshToken,
        envConfig.REFRESH_TOKEN_SECRET,
      )
      await this.prismaService.refreshToken.update({
        where: {
          id: refreshTokenEntity.id,
        },
        data: {
          hashToken: newDecodedRefreshToken.uuid,
          token: token.refreshToken,
          expiresAt: new Date(newDecodedRefreshToken.exp * 1000),
          createdAt: new Date(newDecodedRefreshToken.iat * 1000),
        },
      })
      return token
    } catch (error) {
      if (isNotFoundError(error)) {
        throw new UnauthorizedException('Refresh token was revoked')
      }

      throw new UnauthorizedException('Invalid refresh token')
    }
  }
}
