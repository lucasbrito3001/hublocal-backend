import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>
    ) { }

    async create(createUserDto: CreateUserDto) {
        const { name, email, password } = createUserDto

        const user = await this.findOneByEmail(email)

        if(user !== null) throw new ConflictException('This email already exists')

        const passwordHash = await hash(password, 10)

        const res = await this.usersRepository.save({ name, email, passwordHash });
    
        return { statusCode: 201, message: 'User created successfully' }
    }

    findOneByEmail(email: string) {
        return this.usersRepository.findOneBy({ email })
    }
}
