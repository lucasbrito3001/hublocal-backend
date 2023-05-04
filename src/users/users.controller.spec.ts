import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
    const mockUser = {
        email: 'mock@mock.com',
        password: 'mock1234',
        name: 'mock'
    }

    let controller: UsersController;
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService],
        })
        .overrideProvider(UsersService)
        .useValue({ create: jest.fn().mockImplementationOnce(() => Promise.resolve({ hello: 'world' })) })
        .compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    it("should throw BadRequestException when send the request missing infos", async () => {
        try {
            await controller.create({} as CreateUserDto)
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException)
        }
    });

    it("should return the service response to the client", async () => {
        const res = await controller.create(mockUser)
        expect(res).toStrictEqual({ hello: 'world' })
    })

    it("should call the service method 'create' with the values received on body request", async () => {
        const spySignInService = jest.spyOn(service, 'create')

        await controller.create(mockUser)

        expect(spySignInService).toHaveBeenCalledWith(mockUser)
    })
});
