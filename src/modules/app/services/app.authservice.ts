import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import User from "../../../models/User";
import {Repository} from "typeorm";
import {JwtDto, RegisterDto} from "../dto/authDto";
import {JwtService} from '@nestjs/jwt';
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>, private jwtService: JwtService) {
    }

    async register(dto: RegisterDto, image?: File) {
        const {email, firstName, lastName, password} = dto;
        const existingUser = await this.userRepository.findOne({
            where: {
                email
            }
        });

        if (existingUser) {
            throw new BadRequestException('User already exists', `User with email ${email} already exists`);
        }

        const newUser = this.userRepository.create({
            email,
            firstName,
            lastName,
            password,
        });


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
            newUser.image = imageUrl;
        }



        await this.userRepository.save(newUser);
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userRepository.findOne({
            where: {
                email
            }
        });

        if (user && user.password === pass) {
            const {password, ...result} = user;
            return result;
        }

        return null;
    }

    login(user: User): JwtDto {
        const payload = {username: user.email, id: user.id};
        return {
            accessToken: this.jwtService.sign(payload),
            user,
        };
    }

}
