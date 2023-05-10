import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { EntityManager } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
    const save = jest.fn()
        .mockResolvedValueOnce(true)
    const findOneBy = jest.fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ password: 'mock1234' })

    const mockRepository = { save, findOneBy }

    const mockUser = {
        email: 'mock@mock.com',
        name: 'mock',
        password: 'mock1234'
    }

    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { 
                    provide: getRepositoryToken(User), 
                    useValue: mockRepository
                }
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    it('should create an user sucessfully', async () => {
        const mockHash = jest.fn().mockResolvedValueOnce('hashedPassword')

        const res = await service.create(mockUser, mockHash)

        const expectedParameters = {
            name: mockUser.name,
            email: mockUser.email,
            passwordHash: 'hashedPassword'
        }

        expect(save).toBeCalledWith(expectedParameters)
        expect(res).toStrictEqual({ statusCode: 201, message: 'User created successfully' })
    });

    it('should throw an conflict exception when found an user by the email received', async () => {
        expect(service.create(mockUser)).rejects.toThrow(ConflictException)
    })
});
