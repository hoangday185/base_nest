import { Body, Controller, Get, Post } from '@nestjs/common'
import { PostService } from './post.service'
import { AuthTypes, ConditionGuard } from 'src/shared/constants/auth.constants'
import { Auth } from 'src/shared/decorators/auth.decorator'

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Auth([AuthTypes.Bearer, AuthTypes.ApiKey], { condition: ConditionGuard.Or })
  @Get()
  getPosts() {
    return this.postService.getPosts()
  }

  @Post()
  createPost(@Body() body: any) {
    return this.postService.createPost(body)
  }
}
