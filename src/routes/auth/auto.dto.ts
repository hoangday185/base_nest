import { Exclude } from 'class-transformer'
import { IsString } from 'class-validator'

export class LoginDto {
  @IsString()
  email: string

  @IsString()
  password: string
}

export class RegisterDto extends LoginDto {
  @IsString()
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
