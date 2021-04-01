import {
    Request,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post as PostMethod,
    Put,
    Query,
    UseGuards,
    UseInterceptors, UploadedFile
} from '@nestjs/common';
import {AppService} from '../services/app.service';
import {AuthGuard} from '@nestjs/passport'
import User from "../../../models/User";
import Comment from "../../../models/Comment";
import Post from "../../../models/Post";
import {CreatePostDto} from "../dto/postDto";
import {CreateCommentDto} from "../dto/commentDto";
import Like from "../../../models/Like";
import {UpdateUserDto, UpdateLocationDto} from "../dto/authDto";
import {FileInterceptor} from "@nestjs/platform-express";
import {jpegFileFilter} from "./app.authcontroller";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get()
    greet(): string {
        return 'CHUPIN BOYYYIIIIIII';
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/count')
    async getUserCount(): Promise<number> {
        const count = await this.appService.getUserCount();
        console.log('COUNT', count);
        return count;
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/users')
    async getUsers(): Promise<User[]> {
        return this.appService.getUsers()
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/posts')
    async getPosts(@Query('limit') limit: number, @Query('offset') offset: number): Promise<Post[]> {
        return this.appService.getPosts(limit, offset);
    }

    @UseGuards(AuthGuard('jwt'))
    @PostMethod('/posts')
    async createPost(@Request() req, @Body() dto: CreatePostDto): Promise<Post> {
        return this.appService.createPost(req.user.id, dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/posts/:postId/comments')
    async getCommentsForPost(@Param('postId') postId: number): Promise<Comment[]> {
        return this.appService.getCommentsForPost(postId)
    }

    @UseGuards(AuthGuard('jwt'))
    @PostMethod('/posts/:postId/comments')
    async createCommentForPost(@Request() req, @Param('postId') postId: number, @Body() dto: CreateCommentDto): Promise<void> {
        await this.appService.createCommentForPost(req.user.id, postId, dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/posts/:postId/likes')
    async getLikesForPost(@Param('postId') postId: number, @Query('limit') limit: number, @Query('offset') offset: number): Promise<Like[]> {
        return this.appService.getLikesForPost(postId, limit, offset);
    }

    @UseGuards(AuthGuard('jwt'))
    @PostMethod('/posts/:postId/likes')
    async createLikeForPost(@Request() req, @Param('postId') postId: number): Promise<void> {
        await this.appService.createLikeForPost(req.user.id, postId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/posts/:postId/likes')
    async removeLikeForPost(@Request() req, @Param('postId') postId: number): Promise<void> {
        await this.appService.removeLikeForPost(req.user.id, postId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/me')
    async getMyInfo(@Request() req): Promise<User> {
        return this.appService.getMyInfo(req.user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/me')
    @UseInterceptors(FileInterceptor('image', {
        fileFilter: jpegFileFilter,
        limits: {
            fileSize: 800 * 1024
        }
    }))
    async updateMyInfo(@Request() req, @UploadedFile() image, @Body() dto: UpdateUserDto): Promise<User> {
        return this.appService.updateMyInfo(req.user.id, dto, image);
    }

    @UseGuards(AuthGuard('jwt'))
    @PostMethod('/update-location')
    async updateMyLocation(@Request() req, @Body() dto: UpdateLocationDto): Promise<void> {
        await this.appService.updateMyLocation(req.user.id, dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/get-map')
    async getMapUsers(@Request() req): Promise<User[]> {
        return this.appService.getMapUsers()
    }

}
