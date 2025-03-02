import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { PostService } from './post.service'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { APIKeyGuard } from 'src/shared/guards/api-key.guard'

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(AccessTokenGuard)
  @UseGuards(APIKeyGuard)
  @Get()
  getPosts() {
    return this.postService.getPosts()
  }

  @Post()
  createPost(@Body() body: any) {
    return this.postService.createPost(body)
  }
}
