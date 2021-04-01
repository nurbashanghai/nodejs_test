import {BadRequestException, Injectable} from '@nestjs/common';
import {Connection, Repository, Not, IsNull} from "typeorm";
import {InjectRepository} from '@nestjs/typeorm';
import User from "../../../models/User";
import Post from "../../../models/Post";
import Comment from "../../../models/Comment";
import {CreatePostDto} from "../dto/postDto";
import {CreateCommentDto} from "../dto/commentDto";
import Like from "../../../models/Like";
import {UpdateUserDto, UpdateLocationDto} from "../dto/authDto";
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';
import * as moment from 'moment';

@Injectable()
export class AppService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>,
                @InjectRepository(Post) private postRepository: Repository<Post>,
                @InjectRepository(Comment) private commentRepository: Repository<Comment>,
                @InjectRepository(Like) private likeRepository: Repository<Like>,
                private connection: Connection
    ) {
    }

    async getUserCount(): Promise<number> {
        const result = await this.connection.query('select count(*) from users');
        return result[0].count
    }

    async getMyInfo(userId: number): Promise<User> {
        return this.userRepository.findOne({id: userId});
    }

    async updateMyInfo(userId: number, dto: UpdateUserDto, image?: File): Promise<User> {

        if (dto.birthdate && !moment(dto.birthdate).isValid()) {
            throw new BadRequestException('Birthdate must be YYYY-MM-DD');
        }

        const user = await this.userRepository.findOne({id: userId});

        user.about = dto.about;
        user.firstName = dto.firstName;
        user.lastName = dto.lastName;
        user.birthdate = dto.birthdate;

        if (image) {
            const s3 = new AWS.S3({
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                accessKeyId: process.env.AWS_ACCESS_KEY_ID
            });

            const fileKey = `avatars/${uuid.v4()}.jpg`;
            const params = {
                Bucket: process.env.AWS_S3_IMG_BUCKET,
                Key: fileKey,
                // @ts-ignore
                Body: image.buffer,
                ACL: 'public-read'
            };

            const imageUrl = await new Promise<string>((res, reject) => {
                s3.upload(params, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    res(data.Location);
                });
            });
            user.image = imageUrl;
        }

        return this.userRepository.save(user);
    }

    async getUsers(): Promise<User[]> {
        return this.userRepository.find()
    }

    async getPosts(limit: number = 10, offset: number = 0): Promise<Post[]> {
        const posts = await this.postRepository.find({
            take: limit,
            skip: offset,
            order: {
                created_at: 'DESC',
                id: 'DESC'
            }
        });
        for (const post of posts) {
            console.log('POST', post.user)
            post.likesCount = (await this.getLikesForPost(post.id)).length;
        }
        return posts;
    }

    async getCommentsForPost(postId: number): Promise<Comment[]> {
        return this.commentRepository.find({
            where: {
                post: postId
            }
        })
    }

    async createCommentForPost(userId: number, postId: number, dto: CreateCommentDto): Promise<void> {
        const user = await this.userRepository.findOneOrFail({
            id: userId
        });

        const post = await this.postRepository.findOneOrFail({
            id: postId
        });


        const newComment = this.commentRepository.create({
            content: dto.content,
            post,
            user
        });

        await this.commentRepository.save(newComment);
    }

    async getLikesForPost(postId: number, limit: number = 10, offset: number = 0): Promise<Like[]> {
        return this.likeRepository.find({
            where: {
                type: 'post',
                target_id: postId,
            },
            take: limit, skip: offset
        });
    }

    async createLikeForPost(userId: number, postId: number): Promise<void> {
        const user = await this.userRepository.findOneOrFail({
            id: userId
        });

        await this.postRepository.findOneOrFail({
            id: postId
        });

        const existingLike = await this.likeRepository.findOne({
            user,
            type: 'post',
            target_id: postId
        })

        if (existingLike) {
            throw new BadRequestException('You already liked this post');
        }


        const newLike = this.likeRepository.create({
            type: 'post',
            target_id: postId,
            user
        });

        await this.likeRepository.save(newLike);
    }

    async removeLikeForPost(userId: number, postId: number): Promise<void> {
        const user = await this.userRepository.findOneOrFail({
            id: userId
        });

        await this.postRepository.findOneOrFail({
            id: postId
        });

        const existingLike = await this.likeRepository.findOne({
            user,
            type: 'post',
            target_id: postId
        })

        if (!existingLike) {
            throw new BadRequestException('You did not like this post');
        }

        await this.likeRepository.delete(existingLike.id);
    }


    async createPost(userId: number, dto: CreatePostDto): Promise<Post> {
        const user = await this.userRepository.findOneOrFail({
            id: userId
        });

        const newPost = this.postRepository.create({
            content: dto.content,
            user: user
        });

        return this.postRepository.save(newPost);
    }

    async updateMyLocation(userId: number, dto: UpdateLocationDto): Promise<void> {
        const user = await this.userRepository.findOneOrFail({
            id: userId
        });

        user.latitude = dto.latitude;
        user.longitude = dto.longitude;

        await this.userRepository.save(user);
    }

    async getMapUsers(): Promise<User[]> {
        return this.userRepository.find({
            where: {
                latitude: Not(IsNull()),
                longitude: Not(IsNull()),
            }
        })
    }

}
