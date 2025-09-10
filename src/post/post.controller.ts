import { Controller, Post, Body, UseGuards, Req, Get, Param, ParseIntPipe, Delete, Put } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/CreatePostDto';
import { Request } from 'express';
import { UpdatePostDto } from './dto/updatePostDto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get()
    async getAllPosts() {
        return this.postService.getAllPosts();
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    async createPost(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
        const userId = req.user?.["userId"];
        return this.postService.createPost(createPostDto, userId);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Delete('delete/:id')
    async delete(@Param('id', ParseIntPipe) postId: number, CreatePostDto , @Req() req: Request) {
        const userId = req.user?.["userId"];
        return this.postService.delete(postId, userId);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Put('update/:id')
    async update(@Param('id', ParseIntPipe) postId: number, @Body() updatePostDto: UpdatePostDto , @Req() req: Request) {
        const userId = req.user?.["userId"];
        return this.postService.update(postId, userId, updatePostDto);
    }

}
