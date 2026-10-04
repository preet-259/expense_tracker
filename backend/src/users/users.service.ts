import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) 
        private usersRepository: Repository<User>,
    ) {}
    //find a user by email(used at login)
    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    //create user with hash password
    async create(createUserDto: CreateUserDto): Promise<User> {
        const {name, email, password} = createUserDto;

        //to check if user already exist
        const existingUSer = await this.findByEmail(email);
        if(existingUSer) {
            throw new ConflictException('Email is already registered');
        }

        // Hash the password using bcrypt (10 salt rounds)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //for new user record (create and save)
        const user = this.usersRepository.create({
            name,
            email,
            password_hash: hashedPassword,
        });

        return this.usersRepository.save(user);

    }

}
