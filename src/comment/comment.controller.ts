import { Controller, Post, Body, Req, UseGuards, ParseIntPipe, Param, Delete, Put } from '@nestjs/common';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/CreateCommentDto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCommentDto } from './dto/UpdateCommentDto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard('jwt'))  
  @Post('create')
  create(@Req() req: Request, @Body() createCommentDto: CreateCommentDto) {
    const userId = req.user?.['userId'];
    return this.commentService.createComment(userId, createCommentDto);
  }

  @UseGuards(AuthGuard('jwt')) 
  @Delete('delete/:id')
  delete(@Req() req: Request, @Param('id', ParseIntPipe) commentId: number, @Body("postId") postId: number) {
    const userId = req.user?.['userId'];
    return this.commentService.deleteComment(userId, commentId, postId);
  }

  @UseGuards(AuthGuard('jwt')) 
  @Put('update/:id')
  update(@Param('id', ParseIntPipe) commentId: number, @Req() req: Request, @Body() updateCommentDto: UpdateCommentDto) {
    const userId = req.user?.['userId'];
    return this.commentService.updateComment(commentId, userId, updateCommentDto);
  }
}
