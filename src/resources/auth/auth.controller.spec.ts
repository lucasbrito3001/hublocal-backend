import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const mockUser = {
    email: 'mock@mock.com',
    password: 'mock1234'
}

describe('AuthController', () => {
    let controller: AuthController;
    let service: AuthService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService],
        })
        .overrideProvider(AuthService)
        .useValue({ signIn: jest.fn().mockResolvedValueOnce({ hello: 'world' }) })
        .compile();

        controller = module.get<AuthController>(AuthController);
        service = module.get<AuthService>(AuthService)
    });

    it('should throw BadRequestException when send the request missing infos', async () => {
        expect(controller.signIn({} as AuthUserDto)).rejects.toThrow(BadRequestException)
    });

    it('should return the service response to the client', async () => {
        const res = await controller.signIn(mockUser) 
        expect(res).toStrictEqual({ hello: 'world' })
    })

    it('should call the service signIn with the values received on body request', async () => {
        const spySignInService = jest.spyOn(service, 'signIn')

        await controller.signIn(mockUser)

        expect(spySignInService).toHaveBeenCalledWith(mockUser)
    })
});
