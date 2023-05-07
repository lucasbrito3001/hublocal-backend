import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from '../locations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Location } from '../entities/location.entity';
import { CompaniesService } from '../../companies/companies.service';
import { ResponseOk } from 'src/utils/types/responseOk.type';
import { ForbiddenException } from '@nestjs/common';
import { MockRepository } from 'src/utils/test/repository.mock';
import { UpdateLocationDto } from '../dto/update-location.dto';
import { EntityNotFoundException } from 'src/utils/custom/exceptions.custom';

describe('LocationsService', () => {
    let mockRepository: any
    let findOneCompanyByUser: any
    let service: LocationsService;
    const jwtPayload: any = { "userId": 1, "userEmail": "mock@mock.com", "iat": 1683206041 }
    const mockUpdateLocationDto: UpdateLocationDto = {
        name: 'mock company',
        city: 'mock city',
        street: 'mock street',
        state: 'ms',
        district: 'mock district',
        number: 1,
        zipCode: '12345678',
        companyId: 1
    }

    beforeEach(async () => {
        findOneCompanyByUser = jest.fn()

        mockRepository = new MockRepository()

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

    it('should update a location successfully', async () => {
        const locationId = 1;
        findOneCompanyByUser.mockResolvedValue(new ResponseOk('ok', [{ id: 1 }]))
        const mockUpdate = jest.spyOn(mockRepository, 'update')
        mockUpdate.mockResolvedValue({ affected: 1 })

        const resultUpdate = await service.update(locationId, mockUpdateLocationDto, jwtPayload.userId)

        expect(resultUpdate).toEqual(new ResponseOk('Location updated successfully'))
    });

    it('should call the method findOneCompanyByUser when update a location successfully', async () => {
        const locationId = 1;
        findOneCompanyByUser.mockResolvedValue(new ResponseOk('ok', [{ id: 1 }]))
        const mockUpdate = jest.spyOn(mockRepository, 'update')
        mockUpdate.mockResolvedValue({ affected: 1 })

        await service.update(locationId, mockUpdateLocationDto, jwtPayload.userId)

        expect(findOneCompanyByUser).toBeCalledWith(locationId, mockUpdateLocationDto.companyId)
    });

    it('should call the method update when update a location successfully', async () => {
        const { companyId, ...locationInfos } = mockUpdateLocationDto
        const locationId = 1;
        findOneCompanyByUser.mockResolvedValue(new ResponseOk('ok', [{ id: 1 }]))
        const mockUpdate = jest.spyOn(mockRepository, 'update')
        mockUpdate.mockResolvedValue({ affected: 1 })

        await service.update(locationId, mockUpdateLocationDto, jwtPayload.userId)

        expect(mockUpdate).toBeCalledWith(locationId, locationInfos)
    });

    it("should throw an ForbiddenException when the client tries to update a location that he doesn't own", async () => {
        const locationId = 1
        findOneCompanyByUser.mockResolvedValue(new ResponseOk('error', [null]))

        expect((service.update(locationId, mockUpdateLocationDto, jwtPayload.userId)))
            .rejects
            .toThrow(ForbiddenException)

        expect((service.update(locationId, mockUpdateLocationDto, jwtPayload.userId)))
            .rejects
            .toEqual(new ForbiddenException("This company does not exist for this user"))
    });

    it("should not call the method update when the client tries to update a location that he doesn't own", async () => {
        const locationId = 1
        const mockUpdate = jest.spyOn(mockRepository, 'update')
        findOneCompanyByUser.mockResolvedValue(new ResponseOk('error', [null]))

        expect((service.update(locationId, mockUpdateLocationDto, jwtPayload.userId)))
            .rejects
            .toThrow(ForbiddenException)
        expect(mockUpdate).not.toBeCalled()
    });

    it("should throw an EntityNotFoundException when the client tries to update a location that not exist", async () => {
        const locationId = 1
        const mockUpdate = jest.spyOn(mockRepository, 'update')
        findOneCompanyByUser.mockResolvedValue(new ResponseOk('ok', [{ id: 1 }]))
        mockUpdate.mockResolvedValue({ affected: 0 })

        expect((service.update(locationId, mockUpdateLocationDto, jwtPayload.userId)))
            .rejects
            .toThrow(EntityNotFoundException)

        expect((service.update(locationId, mockUpdateLocationDto, jwtPayload.userId)))
            .rejects
            .toEqual(new EntityNotFoundException('location', 'update'))
    });
});
