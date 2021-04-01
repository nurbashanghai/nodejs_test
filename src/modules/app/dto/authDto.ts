import {IsDate , IsDateString, IsEmail, IsNotEmpty, IsNumber} from "class-validator";
import User from "../../../models/User";
import { isNumber } from "util";

export class RegisterDto {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    password: string;

}

export class UpdateUserDto {

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    about: string;

    birthdate: string;

}

export class UpdateLocationDto {
    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: number;
}

export class LoginDto {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

}

export interface JwtDto {
    accessToken: string;

    user: User

}
