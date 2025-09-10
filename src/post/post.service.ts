import { ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import { CreatePostDto } from './dto/CreatePostDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePostDto } from './dto/updatePostDto';

@Injectable()
export class PostService {
    constructor(private readonly prismaService: PrismaService) {}
    

    async getAllPosts() {
        return this.prismaService.post.findMany({
            include: {
                user: {
                    select:{
                        userId: true,
                        username: true,
                        email: true,
                        password: false,
                    }
                },
                comments: {
                    include:{
                        user: {
                            select:{
                                userId: true,
                                username: true,
                                email: true,
                                password: false,
                            }
                        }
                    }
                },
            }
        });
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
    async delete(postId: number, userId: number){
       const post = await this.prismaService.post.findUnique({
           where: {
               postId
           }
       })
       if(!post){
           throw new NotFoundException('Post not found');
       }
       if(post.userId != userId) throw new ForbiddenException('You are not authorized to delete this post');
       await this.prismaService.post.delete({
           where: {
               postId
           }
       })
       return {
           message: 'Post deleted successfully',
       }
    }

    async update(postId: number, userId: number, updatePostDto: UpdatePostDto){
        const post = await this.prismaService.post.findUnique({
            where: {
                postId
            }
        })
        if(!post){
            throw new NotFoundException('Post not found');
        }
        if(post.userId != userId) throw new ForbiddenException('You are not authorized to update this post'); 
        await this.prismaService.post.update({
            where: {
                postId
            },
            data: {...updatePostDto}
        })
        return {
            message: 'Post updated successfully',
            post: post
        }
    }
  
    
}
