import { Controller, Post, Body, Get, UseGuards, Request  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService : AuthService,
        private userService : UsersService,

    ) {}

    //1. Register Endpoint: POST /auth/register
    @Post('register')
    async register (@Body() createUserDto : CreateUserDto) {
        const user = await this.userService.create(createUserDto);
        const{password_hash, ...result} = user;
        return result;
    }

    // 2. Login Endpoint: POST /auth/login
    @Post('login')
    login(@Body() loginDto: LoginDto) { 
        return this.authService.login(loginDto.email, loginDto.password);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getProfile(@Request() req: any) {
        return req.user;
    }


}
