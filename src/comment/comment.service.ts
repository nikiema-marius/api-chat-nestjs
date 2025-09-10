import { UpdateCommentDto } from './dto/UpdateCommentDto';
import { Injectable, NotFoundException, UnauthorizedException, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/CreateCommentDto';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class CommentService {
    constructor(private readonly prismaService: PrismaService) {}

    async createComment(userId: number, createCommentDto: CreateCommentDto) {
       const {postId, content} = createCommentDto
       const post = await this.prismaService.post.findUnique({
           where: {
               postId
           }
       })
       if(!post){
           throw new NotFoundException('Post not found');
       }
       await this.prismaService.comment.create({
           data: {
               content,
               userId,
               postId,
           }
       })
       return {
           message: 'Comment created successfully',
       }
    }
    
    async deleteComment(userId: number, commentId: number, postId: number) {
        const comment = await this.prismaService.comment.findUnique({
          where: { commentId }
        });
      
        if (!comment) {
          throw new NotFoundException('Comment not found');
        }
        if (comment.postId !== postId) {
          throw new UnauthorizedException('Post does not match');
        }
        if (comment.userId !== userId) {
          throw new ForbiddenException('You are not authorized to delete this comment');
        }
      
        await this.prismaService.comment.delete({
          where: { commentId }
        });
      
        return { message: 'Comment deleted successfully' };
      }

      async updateComment(commentId: number, userId: number, updateCommentDto:UpdateCommentDto){
        const {content, postId} = updateCommentDto;
        const comment = await this.prismaService.comment.findUnique({
          where: { commentId }
        });
      
        if (!comment) {
          throw new NotFoundException('Comment not found');
        }
        if (comment.postId !== postId) {
          throw new UnauthorizedException('Post does not match');
        }
        if (comment.userId !== userId) {
          throw new ForbiddenException('You are not authorized to delete this comment');
        }
        await this.prismaService.comment.update({
          where: { commentId },
          data: { content }
        });
        return { message: 'Comment updated successfully' };
      }
      
}
