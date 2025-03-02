import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'
import { HashingService } from './services/hashing.service'
import { TokenService } from './services/token.service'
import { JwtModule } from '@nestjs/jwt'

const shareService = [PrismaService, HashingService, TokenService]

@Global()
@Module({
  imports: [JwtModule],
  providers: shareService,
  exports: shareService,
})
export class SharedModule {}
