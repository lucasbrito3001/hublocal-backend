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
                .mockImplementationOnce(() => Promise.resolve(mockUser))
                .mockImplementationOnce(() => Promise.resolve(null))
                .mockImplementationOnce(() => Promise.resolve(mockUser))
        })
        .overrideProvider(JwtService)
        .useValue({ signAsync: jest.fn().mockImplementation(() => Promise.resolve('jwt')) })
        .compile();

        service = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
    });

    it('should authenticate an user successfully', async () => {
        const spyFindUserByEmail = jest.spyOn(usersService, 'findOneByEmail')
        const mockCompare = jest.fn().mockImplementationOnce(() => Promise.resolve(true))

        const user = { email: 'mock@mock.com', password: 'mock1234' }

        const res = await service.signIn(user, mockCompare)

        expect(spyFindUserByEmail).toHaveBeenCalledWith(user.email)
        expect(mockCompare).toHaveBeenCalledWith('mock1234', 'mockPasswordHash')
        expect(res).toStrictEqual({ statusCode: 200, token: 'jwt' })
    })

    it('should throw unauthorized error when not found an user with the received email', async () => {
        try {
            await service.signIn({ email: 'teste@teste.com', password: 'teste123' })
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedException)
        }
    })

    it('should throw unauthorized error when the password are incorrect', async () => {
        try {
            const mockCompare = jest.fn().mockImplementationOnce(() => Promise.resolve(false))
            await service.signIn({ email: 'teste@teste.com', password: 'teste123' }, mockCompare)
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedException)
        }
    })
});
