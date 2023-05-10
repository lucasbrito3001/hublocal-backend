import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/resources/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { configService } from 'src/utils/config/config.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: configService.getJwtSecret(),
            signOptions: { expiresIn: '1h' }
        })
    ]
})
export class AuthModule { }
