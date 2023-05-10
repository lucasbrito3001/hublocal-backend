import { 
    BadRequestException, 
    Body, 
    Controller, 
    HttpCode, 
    HttpStatus,
    Post
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: 200, description: 'User authenticated succesfully' })
    @ApiResponse({ status: 401, description: 'The client send bad credentials' })
    async signIn(@Body() authValues: AuthUserDto) {
        const { email, password } = authValues

        if(!email || !password) throw new BadRequestException('Missing infos')

        return await this.authService.signIn(authValues)        
    }
}
