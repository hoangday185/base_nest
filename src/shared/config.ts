import { plainToInstance } from 'class-transformer'
import { IsString, validateSync } from 'class-validator'
import * as fs from 'fs'
import path from 'path'
import { config } from 'dotenv'
config({
  path: '.env',
})
if (!fs.existsSync(path.resolve('.env'))) {
  console.error('Please create a .env file in the root directory')
  process.exit(1)
}

class ConfigSchema {
  DATABASE_URL: string

  @IsString()
  ACCESS_TOKEN_SECRET: string

  @IsString()
  REFRESH_TOKEN_SECRET: string

  @IsString()
  ACCESS_TOKEN_EXPIRATION: string

  @IsString()
  REFRESH_TOKEN_EXPIRATION: string

  @IsString()
  SECRET_API_KEY: string
}

const configServer = plainToInstance(ConfigSchema, process.env)
const e = validateSync(configServer)
//ahihi
if (e.length > 0) {
  const errors = e
    .map((item) => ({
      property: item.property,
      constraints: item.constraints,
      value: item.value,
    }))
    .join('\n')

  throw errors
}

const envConfig = configServer
export default envConfig
