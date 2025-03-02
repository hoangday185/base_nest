export const REQUEST_USER_KEY = 'user'

export const AuthTypes = {
  Bearer: 'Bearer',
  None: 'none',
  ApiKey: 'ApiKey',
} as const

export type AuthTypesOption = (typeof AuthTypes)[keyof typeof AuthTypes]

export const ConditionGuard = {
  And: 'And',
  Or: 'Or',
} as const

export type ConditionGuardType =
  (typeof ConditionGuard)[keyof typeof ConditionGuard]
