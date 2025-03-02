export interface JwtPayload {
  userId: number
  uuid: string
  iat?: number
  exp?: number
}
