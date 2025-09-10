import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/CreatePostDto';
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

}
