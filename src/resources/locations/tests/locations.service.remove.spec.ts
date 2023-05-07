import { MockRepository } from "src/utils/test/repository.mock";
import { LocationsService } from "../locations.service";
import { Test, TestingModule } from "@nestjs/testing";
import { CompaniesService } from "src/resources/companies/companies.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ResponseOk } from "src/utils/types/responseOk.type";
import { Location } from "../entities/location.entity";
import { EntityNotFoundException } from "src/utils/custom/exceptions.custom";
import { ForbiddenException } from "@nestjs/common";

describe('LocationsService', () => {
    let mockRepository: any
    let findOneCompanyByUser: any
    let service: LocationsService;
    const jwtPayload: any = { "userId": 1, "userEmail": "mock@mock.com", "iat": 1683206041 }

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

    it('should delete a location successfully',
        async () => {
            findOneCompanyByUser.mockResolvedValueOnce(new ResponseOk('ok', [{ id: 1 }]))
            const spyFindOne = jest.spyOn(service, 'findOne')
                .mockResolvedValueOnce(new ResponseOk('ok', [{ companyId: 1 }]))
            const spyDelete = jest.spyOn(mockRepository, 'delete')
                spyDelete.mockResolvedValueOnce({ affected: 1 })

            const responseDelete = await service.remove(1, jwtPayload.userId)

            expect(responseDelete).toBeInstanceOf(ResponseOk)
        }
    )

    it("should throw an EntityNotFoundException when the client tries to delete an location that doesn't exist",
        async () => {
            jest.spyOn(service, 'findOne')
                .mockResolvedValueOnce(new ResponseOk('ok', [null]))

            expect(service.remove(1, jwtPayload.userId)).rejects.toThrow(EntityNotFoundException)
        }
    )

    it("should throw an ForbiddenException when the client tries to delete an location that doesn't exist",
        async () => {
            findOneCompanyByUser.mockResolvedValueOnce(new ResponseOk('ok', [null]))
            jest.spyOn(service, 'findOne')
                .mockResolvedValueOnce(new ResponseOk('ok', [{ companyId: 1 }]))

            expect(service.remove(1, jwtPayload.userId)).rejects.toThrow(ForbiddenException)
        }
    )
})