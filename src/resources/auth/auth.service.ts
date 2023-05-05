import { Injectable, UnauthorizedException } from '@nestjs/common';

import { compare as bcryptCompare } from 'bcrypt'
import { UsersService } from '../users/users.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { JwtService } from '@nestjs/jwt';

type signInResponse = {
    statusCode: number,
    token: string
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async signIn( { email, password }: AuthUserDto, compare = bcryptCompare ): Promise<signInResponse> {
        const userFound = await this.usersService.findOneByEmail(email)
        if(userFound === null) throw new UnauthorizedException()

        const isMatch = await compare(password, userFound.passwordHash)
        if(!isMatch) throw new UnauthorizedException()

        const jwtPayload = { userId: userFound.id, userEmail: userFound.email }

        return { statusCode: 200, token: await this.jwtService.signAsync(jwtPayload) }
    }
}
