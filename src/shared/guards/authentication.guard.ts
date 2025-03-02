import { APIKeyGuard } from 'src/shared/guards/api-key.guard'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import {
  AUTH_TYPES_KEY,
  AuthTypesDecoratorPayload,
} from '../decorators/auth.decorator'
import { AuthTypes, ConditionGuard } from '../constants/auth.constants'

@Injectable()
export class AuthenticationGuard implements CanActivate {
  //lấy ra các guard tương ứng với từng loại auth
  private readonly authTypeMapGuard: Record<string, CanActivate> = {
    [AuthTypes.Bearer]: this.accessTokenGuard,
    [AuthTypes.ApiKey]: this.apiKeyGuard,
    [AuthTypes.None]: { canActivate: () => true },
  }

  constructor(
    //inject các service cần
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: APIKeyGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypeValue = this.reflector.getAllAndOverride<
      AuthTypesDecoratorPayload | undefined
    >(AUTH_TYPES_KEY, [context.getHandler(), context.getClass()]) ?? {
      authTypes: [AuthTypes.None],
      options: { condition: ConditionGuard.And },
    } //lấy ra các guard tương ứng với route ko thì mặc định là None

    const guard = authTypeValue.authTypes.map(
      (authType) => this.authTypeMapGuard[authType],
    ) //map vào các guard tương ứng với từng loại auth

    let error = new UnauthorizedException()
    if (authTypeValue.options.condition === ConditionGuard.And) {
      //nếu condition là And thì cần tất cả guard đều true mới pass được
      for (const g of guard) {
        const canActive = await Promise.resolve(g.canActivate(context)).catch(
          (err) => {
            error = err
            return false
          },
        )
        if (!canActive) throw error
      }
      return true
    } else {
      //nếu condition là Or thì chỉ cần 1 guard true là pass
      for (const g of guard) {
        const canActive = await Promise.resolve(g.canActivate(context)).catch(
          (err) => {
            error = err
            return false
          },
        )
        if (canActive) return true
      }
    }
    throw error
  }
}
