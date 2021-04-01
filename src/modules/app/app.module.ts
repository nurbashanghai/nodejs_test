import {Module} from '@nestjs/common';
import {AppController} from './controllers/app.controller';
import {AppService} from './services/app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthController} from "./controllers/app.authcontroller";
import {AuthService} from "./services/app.authservice";
import User from "../../models/User";
import Post from "../../models/Post";
import Comment from "../../models/Comment";
import {LocalStrategy} from "./services/auth.localstrategy";
import {JwtModule} from '@nestjs/jwt';
import {jwtConstants} from "./constants";
import {JwtStrategy} from "./services/auth.jwtstrategy";
import {PassportModule} from '@nestjs/passport';
import Like from "../../models/Like";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            synchronize: false
        }),
        TypeOrmModule.forFeature([User, Post, Comment, Like]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {expiresIn: '600h'},
        }),
    ],
    controllers: [AppController, AuthController],
    providers: [AppService, AuthService, LocalStrategy, JwtStrategy],
})
export class AppModule {
}
