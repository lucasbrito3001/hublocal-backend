import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from '../locations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Location } from '../entities/location.entity';
import { CompaniesService } from '../../companies/companies.service';
import { ResponseCreated, ResponseOk } from 'src/utils/types/responseOk.type';
import { CreateLocationDto } from '../dto/create-location.dto';
import { ForbiddenException } from '@nestjs/common';
import { UtilsService } from 'src/resources/utils/utils.service';

describe('LocationsService - Create', () => {
    const helloWorldExample = { hello: 'world' }
    const jwtPayload: any = { "userId": 1, "userEmail": "mock@mock.com", "iat": 1683206041 }
    let mockRepository: any

    let findAndCount: any
    let save: any
    let update: any
    let deleteFn: any
    let findOneCompanyByUser: any

    let service: LocationsService;

    beforeEach(async () => {
        findAndCount = jest.fn()
        save = jest.fn()
        update = jest.fn()
        deleteFn = jest.fn()
        findOneCompanyByUser = jest.fn()

        mockRepository = { findAndCount, save, update, delete: deleteFn }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LocationsService,
                CompaniesService,
                UtilsService,
                {
                    provide: getRepositoryToken(Location),
                    useValue: mockRepository
                }
            ],
        })
            .overrideProvider(CompaniesService).useValue({ findOneByUser: findOneCompanyByUser })
            .compile();

        service = module.get<LocationsService>(LocationsService);
    });

    it('should read all the company locations successfully', async () => {
        const companyId = 1
        const findResponse = [helloWorldExample, helloWorldExample]
        findAndCount.mockResolvedValue([findResponse, 10])
        findOneCompanyByUser.mockResolvedValueOnce(new ResponseOk('ok', [{ id: 1 }]))

        const resultFindAllByCompany = await service.findAllByCompany(
            companyId,
            jwtPayload.userId,
            0,
            10
        )

        expect(resultFindAllByCompany).toEqual(new ResponseOk('ok', findResponse, { totalLocations: 10 }))
    })

    it('should call the function find filtering by the companyId when read succesfully', async () => {
        const companyId = 1
        const findResponse = [helloWorldExample, helloWorldExample]
        findAndCount.mockResolvedValue(findResponse)
        findOneCompanyByUser.mockResolvedValueOnce(new ResponseOk('ok', [{ id: 1 }]))

        await service.findAllByCompany(companyId, jwtPayload.userId, 0, 10)

        expect(findAndCount).toBeCalledWith({
            where: { company: { id: companyId } },
            order: { id: 'asc' },
            take: 10,
            skip: 0
        })
    })

    it('should call the function findOneCompanyByUser with the companyId and userId receiveds by parameters', async () => {
        const companyId = 1
        const findResponse = [helloWorldExample, helloWorldExample]
        findAndCount.mockResolvedValue(findResponse)
        findOneCompanyByUser.mockResolvedValueOnce(new ResponseOk('ok', [{ id: 1 }]))

        await service.findAllByCompany(companyId, jwtPayload.userId, 0, 10)

        expect(findOneCompanyByUser).toBeCalledWith(companyId, jwtPayload.userId)
    })

    it("should throw an exception when the client tries to read locations of a company that he doesn't own", async () => {
        const companyId = 1
        findOneCompanyByUser.mockResolvedValueOnce(new ResponseOk('Client is not the company owner', [null]))

        expect(service.findAllByCompany(companyId, jwtPayload.userId, 0, 10))
            .rejects
            .toThrow(ForbiddenException)
    })

    it("should throw an exception when the client tries to read locations of a company that he doesn't own", async () => {
        const companyId = 1
        findOneCompanyByUser.mockResolvedValueOnce(new ResponseOk(
            'Client is not the company owner',
            [null]
        ))

        expect(service.findAllByCompany(companyId, jwtPayload.userId, 0, 10))
            .rejects
            .toStrictEqual(new ForbiddenException("This company does not exist for this user"))
    })
})