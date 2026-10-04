import {Injectable, UnauthorizedException} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        private configService: ConfigService,
        private userService: UsersService
    ) {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        if (!jwtSecret) {
        throw new Error('FATAL ERROR: JWT_SECRET environment variable is not defined!');
        }

        super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: jwtSecret,
        });
    }
    async validate(payload: any) {
        console.log('Payload decoded:', payload);
        //to check if users exist in our database
        const user = await this.userService.findByEmail(payload.email);
        console.log('User found in DB:', user ? 'Yes (Access Granted)' : 'No (Access Denied)');
        if(!user) {
            throw new  UnauthorizedException();
        }

        const { password_hash, ...result } = user;
        return result; 
    }
}