import {IsEmail, IsNotEmpty, MinLength} from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty ({message:'Name is required'})
    name! :string;

    @IsEmail ({}, {message:'Please Enter a Valid Email'})
    email!: string;

    @MinLength (6, {message: 'Paasword length must be 6 characters at least'})
    password!: string;
}