import { SetMetadata } from '@nestjs/common'
import {
  AuthTypesOption,
  ConditionGuardType,
} from '../constants/auth.constants'

export const Auth = (
  authTypes: AuthTypesOption,
  options: { condition: ConditionGuardType },
) => {
  return SetMetadata(authTypes, { authTypes, options })
}
