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
    const jwtPayload: any = { "userId": 1, "userEmail": "mock@mock.com", "iat": 1683206041 }
    let mockRepository: any
    const mockLocation: CreateLocationDto = {
        name: 'mock company',
        city: 'mock city',
        street: 'mock street',
        state: 'ms',
        companyId: 1,
        district: 'mock district',
        number: 1,
        zipCode: '12345678'
    }

    let save: any
    let findOneCompanyByUser: any
    let clearNumberString: any

    let service: LocationsService;

    beforeEach(async () => {
        save = jest.fn()
        findOneCompanyByUser = jest.fn()
        clearNumberString = jest.fn()

        mockRepository = { save }

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
        .overrideProvider(UtilsService).useValue({ clearNumberString })
        .compile();

        service = module.get<LocationsService>(LocationsService);
    });

    it('should create a location successfully', async () => {
        mockRepository.save.mockResolvedValueOnce()
        findOneCompanyByUser.mockResolvedValueOnce(new ResponseOk('ok', [{ id: 1 }]))
        clearNumberString.mockReturnValueOnce('123')

        const resultCreate = await service.create(mockLocation, jwtPayload.userId)

        expect(resultCreate).toStrictEqual(new ResponseCreated('Location created successfully'))
    });

    it('should call the findOneByUser method and the save method when create succesfully', async () => {
        const formattedZipCode = '123321'
        mockRepository.save.mockResolvedValueOnce()
        findOneCompanyByUser.mockResolvedValueOnce(new ResponseOk('ok', [{ id: 1 }]))
        clearNumberString.mockReturnValueOnce(formattedZipCode)
        const { companyId, ...locationInfos } = mockLocation

        await service.create(mockLocation, jwtPayload.userId)

        expect(mockRepository.save).toBeCalledWith({ ...{ ...locationInfos, zipCode: formattedZipCode }, company: { id: companyId } })
        expect(findOneCompanyByUser).toBeCalledWith(companyId, jwtPayload.userId)
    })

    it("should throw an ForbiddenException when client tries to create a location for a company it doesn't own", async () => {
        findOneCompanyByUser.mockResolvedValueOnce(new ResponseOk('', [null]))

        expect(service.create(mockLocation, jwtPayload.userId)).rejects.toThrow(ForbiddenException)
    });

    it("should match the text from ForbiddenException when client tries to create a location for a company it don't own", async () => {
        findOneCompanyByUser.mockResolvedValueOnce(new ResponseOk('', [null]))

        expect(service.create(mockLocation, jwtPayload.userId))
            .rejects
            .toStrictEqual(new ForbiddenException("This company does not exist for this user"))
    });

    it("should not call the function save when client tries to create a location for a company it doesn't own", () => {
        expect(service.create(mockLocation, jwtPayload.userId)).rejects.toThrow()
        expect(mockRepository.save).not.toBeCalled()
    })
});
