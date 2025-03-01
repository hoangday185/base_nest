import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import './shared/config'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor'
import { TransformInterceptor } from './shared/interceptors/tranform.interceptor'
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  )
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove undeclare properties don't decorator in dto
      forbidNonWhitelisted: true, // throw error when have undeclare properties in dto
      transform: true, // transform type of dto
      transformOptions: {
        enableImplicitConversion: true, // enable transform type of dto
      },
      exceptionFactory: (errors) => {
        // console.log(errors)
        return new UnprocessableEntityException(
          errors.map((e) => ({
            field: e.property,
            error: Object.values(e.constraints).join(', '),
          })),
        )
      },
    }),
  )
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
