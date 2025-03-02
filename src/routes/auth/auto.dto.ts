import { Exclude } from 'class-transformer'
import { IsString, IsStrongPassword } from 'class-validator'
import { IsMatchPassword } from 'src/shared/decorators/custom-validate.decorator'

export class LoginDto {
  @IsString()
  email: string

  @IsString()
  @IsStrongPassword()
  password: string
}

export class RegisterDto extends LoginDto {
  @IsString()
  @IsMatchPassword('password')
  confirmPassword: string

  @IsString()
  name: string
}

export class RegisterResponseDto {
  id: number
  email: string
  name: string
  @Exclude() password: string
  createdAt: Date
  updatedAt: Date

  //if you to add a new field that is not in the model
  //   @Expose()
  //   get emailName(): string {
  //     return `${this.email} ${this.name}`
  //   }
  constructor(patial: Partial<RegisterResponseDto>) {
    Object.assign(this, patial)
  }
}

export class LoginResponseDto {
  accessToken: string
  refreshToken: string

  constructor(patial: Partial<LoginResponseDto>) {
    Object.assign(this, patial)
  }
}

export class RefreshTokenBodyDto {
  @IsString()
  refreshToken: string
}
