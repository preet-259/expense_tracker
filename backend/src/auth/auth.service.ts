import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService : UsersService,
        private jwtService : JwtService,
    ){}

    //validate user credentials and return a token
    async login(email : string, pass: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        //password compare (password with hashPassword)
        const isMatch =  await bcrypt.compare(pass, user.password_hash);
        if(!isMatch) {
            throw new UnauthorizedException('Invalid email or password');
        }

        //Generate JWT token
        const payload = {sub: user.id, email: user.email};

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
