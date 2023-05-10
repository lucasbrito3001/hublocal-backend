import { Test, TestingModule } from '@nestjs/testing'
import { CompaniesService } from '../companies.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Company } from '../entities/company.entity'
import { DuplicatedUniqueKeyException, EntityNotFoundException, ImposibleDeleteByRelationException, InvalidCnpjException, MissingRequiredInformationException } from 'src/utils/custom/exceptions.custom'
import { ResponseOk } from 'src/utils/types/responseOk.type'
import { UtilsService } from 'src/resources/utils/utils.service'
import { LocationsService } from 'src/resources/locations/locations.service'

describe('CompaniesService', () => {
    const validCNPJ = '75.177.950/0001-95'
    const invalidCnpj = '00000000000000'

    const mockCompanyValidCnpj = {
        name: 'mock company',
        cnpj: validCNPJ,
        website: 'website'
    }

    const mockCompanyInvalidCnpj = { ...mockCompanyValidCnpj, cnpj: invalidCnpj }

    const jwtPayload = {
        "userId": 1,
        "userEmail": "mock@mock.com",
        "iat": 1683206041
    }

    let findOne: any
    let deleteFn: any

    let service: CompaniesService

    beforeEach(async () => {
        findOne = jest.fn()
        deleteFn = jest.fn()

        const mockRepository = { findOne, delete: deleteFn }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CompaniesService,
                LocationsService,
                UtilsService,
                {
                    provide: getRepositoryToken(Company),
                    useValue: mockRepository
                }
            ],
        })
        .overrideProvider(UtilsService).useValue({})
        .overrideProvider(LocationsService).useValue({})
        .compile()

        service = module.get<CompaniesService>(CompaniesService)
    })

    it('should delete a company successfully', async () => {
        deleteFn.mockResolvedValueOnce({ affected: 1 })

        const responseDelete = await service.remove(1, jwtPayload.userId)

        expect(responseDelete).toBeInstanceOf(ResponseOk)
    })

    it('should throw an EntityNotFoundException because the company not exists', async () => {
        deleteFn.mockResolvedValueOnce({ affected: 0 })

        expect(service.remove(1, jwtPayload.userId)).rejects.toThrow(EntityNotFoundException)
    })

    it('should call the repository method with userId and idCompany', async () => {
        deleteFn.mockResolvedValueOnce({ affected: 1 })

        await service.remove(1, jwtPayload.userId)

        expect(deleteFn).toHaveBeenCalledWith({ id: 1, user: { id: jwtPayload.userId } })
    })

    it('should throw an RelationException when try to delete a company that have relations active with some locations', () => {
        findOne.mockResolvedValue({ id: 1, locations: [1] })

        expect(service.remove(1, jwtPayload.userId)).rejects.toEqual(new ImposibleDeleteByRelationException())
    })

    it('should throw an RelationException when try to delete a company that have relations active with some locations', () => {
        findOne.mockResolvedValue({ id: 1, locations: [1] })

        expect(service.remove(1, jwtPayload.userId)).rejects.toBeInstanceOf(ImposibleDeleteByRelationException)
    })
})
