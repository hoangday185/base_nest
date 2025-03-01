import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PostModule } from './routes/post/post.module'
import { SharedModule } from './shared/shared.module'
import { AuthModule } from './routes/auth/auth.module'
import { HashingService } from './shared/services/hashing.service'

@Module({
  imports: [PostModule, SharedModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    HashingService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
