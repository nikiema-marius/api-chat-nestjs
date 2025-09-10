import { Controller, Post, Body, UseGuards, Req, Get, Patch, Delete, Param } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/CreatePostDto';
import { UpdatePostDto } from './dto/UpdatePostDto';
import { Request } from 'express';
    
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

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    async updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Req() req: Request) {
        const userId = req.user?.["userId"];
        return this.postService.updatePost(Number(id), updatePostDto, userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async deletePost(@Param('id') id: string, @Req() req: Request) {
        const userId = req.user?.["userId"];
        return this.postService.deletePost(Number(id), userId);
    }
}
