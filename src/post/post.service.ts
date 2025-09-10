import { Injectable} from '@nestjs/common';
import { CreatePostDto } from './dto/CreatePostDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
    constructor(private readonly prismaService: PrismaService) {}
    

    async getAllPosts() {
        return this.prismaService.post.findMany();
    }
    async createPost(createPostDto: CreatePostDto, userId: number) {
        const {title, body} = createPostDto;
        const post = await this.prismaService.post.create({
            data: {
              title,
              body: body,
              userId: Number(userId), // passe juste la FK
            },
          });
          return {
            message: 'Post created successfully',
            post: post
          }
    }

    
}
