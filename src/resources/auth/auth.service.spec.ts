import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

const mockUser = {
    id: 1,
    email: 'mock@mock.com',
    passwordHash: 'mockPasswordHash',
    name: 'mock user'
}

describe('AuthService', () => {
    let service: AuthService;
    let usersService: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, UsersService, JwtService]
        })
        .overrideProvider(UsersService)
        .useValue({
            findOneByEmail: jest.fn()
                .mockResolvedValueOnce(mockUser)
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(mockUser)
        })
        .overrideProvider(JwtService)
        .useValue({ signAsync: jest.fn().mockResolvedValueOnce('jwt') })
        .compile();

        service = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
    });

    it('should authenticate an user successfully', async () => {
        const spyFindUserByEmail = jest.spyOn(usersService, 'findOneByEmail')
        const mockCompare = jest.fn().mockResolvedValueOnce(true)

        const user = { email: 'mock@mock.com', password: 'mock1234' }

        const res = await service.signIn(user, mockCompare)

        expect(spyFindUserByEmail).toHaveBeenCalledWith(user.email)
        expect(mockCompare).toHaveBeenCalledWith('mock1234', 'mockPasswordHash')
        expect(res).toStrictEqual({ statusCode: 200, token: 'jwt' })
    })

    it('should throw unauthorized error when not found an user with the received email', async () => {
        const sigInPayload = { email: 'teste@teste.com', password: 'teste123' }
        expect(service.signIn(sigInPayload)).rejects.toThrow(UnauthorizedException)
    })

    it('should throw unauthorized error when the password are incorrect', async () => {
        const mockCompare = jest.fn().mockResolvedValueOnce(false)
        const sigInPayload = { email: 'teste@teste.com', password: 'teste123' }

        expect(service.signIn(sigInPayload, mockCompare)).rejects.toThrow(UnauthorizedException)
    })
});
