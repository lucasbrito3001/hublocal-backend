import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from '../locations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Location } from '../entities/location.entity';
import { CompaniesService } from '../../companies/companies.service';
import { ResponseCreated, ResponseOk } from 'src/utils/types/responseOk.type';
import { CreateLocationDto } from '../dto/create-location.dto';
import { ForbiddenException } from '@nestjs/common';

describe('LocationsService - Create', () => {
    const helloWorldExample = { hello: 'world' }
    const jwtPayload: any = { "userId": 1, "userEmail": "mock@mock.com", "iat": 1683206041 }
    let mockRepository: any

    let find: any
    let save: any
    let update: any
    let deleteFn: any
    let findOneCompanyByUser: any

    let service: LocationsService;

    beforeEach(async () => {
        find = jest.fn()
        save = jest.fn()
        update = jest.fn()
        deleteFn = jest.fn()
        findOneCompanyByUser = jest.fn()

        mockRepository = { find, save, update, delete: deleteFn }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LocationsService,
                CompaniesService,
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

    it('should read all the company locations successfully', async() => {
        const companyId = 1
        const findResponse = [helloWorldExample, helloWorldExample]
        find.mockResolvedValue(findResponse)
        findOneCompanyByUser.mockResolvedValueOnce(new ResponseOk('ok', [{ id: 1 }]))

        const resultFindAllByCompany = await service.findAllByCompany(companyId, jwtPayload.userId)

        expect(resultFindAllByCompany).toEqual(new ResponseOk('ok', findResponse))
    })

    it('should call the function find filtering by the companyId when read succesfully', async () => {
        const companyId = 1
        const findResponse = [helloWorldExample, helloWorldExample]
        find.mockResolvedValue(findResponse)
        findOneCompanyByUser.mockResolvedValueOnce(new ResponseOk('ok', [{ id: 1 }]))

        await service.findAllByCompany(companyId, jwtPayload.userId)

        expect(find).toBeCalledWith({ where: { company: { id: companyId } } })
    })

    it('should call the function findOneCompanyByUser with the companyId and userId receiveds by parameters', async () => {
        const companyId = 1
        const findResponse = [helloWorldExample, helloWorldExample]
        find.mockResolvedValue(findResponse)
        findOneCompanyByUser.mockResolvedValueOnce(new ResponseOk('ok', [{ id: 1 }]))

        await service.findAllByCompany(companyId, jwtPayload.userId)

        expect(findOneCompanyByUser).toBeCalledWith(companyId, jwtPayload.userId)
    })

    it("should throw an exception when the client tries to read locations of a company that he doesn't own", async () => {
        const companyId = 1
        findOneCompanyByUser.mockResolvedValueOnce(new ResponseOk('Client is not the company owner', [null]))

        expect(service.findAllByCompany(companyId, jwtPayload.userId)).rejects.toThrow(ForbiddenException)
    })

    it("should throw an exception when the client tries to read locations of a company that he doesn't own", async () => {
        const companyId = 1
        findOneCompanyByUser.mockResolvedValueOnce(new ResponseOk('Client is not the company owner', [null]))

        expect(service.findAllByCompany(companyId, jwtPayload.userId))
            .rejects
            .toStrictEqual(new ForbiddenException("This company does not exist for this user"))
    })
})