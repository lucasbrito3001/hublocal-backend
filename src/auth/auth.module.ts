import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { configService } from 'src/config/config.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: configService.getJwtSecret(),
            signOptions: { expiresIn: '5m' }
        })
    ]
})
export class AuthModule { }
