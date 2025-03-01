import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}
  getPosts() {
    return this.prismaService.post.findMany({})
  }

  createPost(post: any) {
    return this.prismaService.post.create({
      data: {
        title: post.title,
        content: post.content,
        authorId: 1,
      },
    })
  }
}
