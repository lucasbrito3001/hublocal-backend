import { 
    Controller,
    Post,
    Body,
    BadRequestException
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { MissingRequiredInformationException } from 'src/utils/custom/exceptions.custom';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @ApiResponse({ status: 201, description: 'User created' })
    @ApiResponse({ status: 400, description: 'Client send the request missing infos' })
    @ApiResponse({ status: 409, description: 'Client send an email that already exists' })
    async create(@Body() createUserDto: CreateUserDto) {
        const { name, email, password } = createUserDto

        if(!name || !email || !password) throw new MissingRequiredInformationException('creating')

        return await this.usersService.create({ name, email, password });
    }
}

