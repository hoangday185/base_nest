import { Body, Controller, Get, Post } from '@nestjs/common'
import { PostService } from './post.service'

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}
  @Get()
  getPosts() {
    return this.postService.getPosts()
  }

  @Post()
  createPost(@Body() body: any) {
    return this.postService.createPost(body)
  }
}
