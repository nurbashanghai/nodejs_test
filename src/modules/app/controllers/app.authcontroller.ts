import {Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {AuthService} from "../services/app.authservice";
import * as path from "path";
import {FileInterceptor} from "@nestjs/platform-express";
import {JwtDto, RegisterDto} from "../dto/authDto";
import User from "../../../models/User";
import {LocalAuthGuard} from "../services/auth.localstrategy";

export const jpegFileFilter = (req, file, callback) => {

    let ext = (path.extname(file.originalname) || '').toLowerCase();

    if(ext !== '.jpg' && ext !== '.jpeg') {
        console.log(ext);
        req.fileValidationError = 'Invalid file type';
        return callback(new Error('Invalid file type'), false);
    }

    return callback(null, true);

};

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    @UseInterceptors(FileInterceptor('image', {
        fileFilter: jpegFileFilter,
        limits: {
            fileSize: 800 * 1024
        }
    }))
    async register(@UploadedFile() image, @Body() dto: RegisterDto): Promise<void> {
        await this.authService.register(dto, image);
    }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Req() request: { user: User }): Promise<JwtDto> {
        console.log(request);
        return this.authService.login(request.user)
    }

}
