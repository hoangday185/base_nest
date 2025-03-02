import { SetMetadata } from '@nestjs/common'
import {
  AuthTypesOption,
  ConditionGuardType,
} from '../constants/auth.constants'

export const AUTH_TYPES_KEY = 'authTypes'

export type AuthTypesDecoratorPayload = {
  authTypes: AuthTypesOption[]
  options: { condition: ConditionGuardType }
}

export const Auth = (
  authTypes: AuthTypesOption[],
  options: { condition: ConditionGuardType },
) => {
  return SetMetadata(AUTH_TYPES_KEY, { authTypes, options })
}
