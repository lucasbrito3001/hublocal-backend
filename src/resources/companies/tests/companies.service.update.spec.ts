import { Test, TestingModule } from '@nestjs/testing'
import { CompaniesService } from '../companies.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Company } from '../entities/company.entity'
import { DuplicatedUniqueKeyException, EntityNotFoundException, InvalidCnpjException, MissingRequiredInformationException } from 'src/utils/custom/exceptions.custom'
import { ResponseOk } from 'src/utils/types/responseOk.type'
import { UtilsService } from 'src/resources/utils/utils.service'

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

    let findOneBy: any
    let update: any
    let clearNumberString: any

    let service: CompaniesService

    beforeEach(async () => {
        findOneBy = jest.fn()
        update = jest.fn()
        clearNumberString = jest.fn()

        const mockRepository = { findOneBy, update }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CompaniesService,
                UtilsService,
                {
                    provide: getRepositoryToken(Company),
                    useValue: mockRepository
                }
            ],
        })
            .overrideProvider(UtilsService).useValue({ clearNumberString })
            .compile()

        service = module.get<CompaniesService>(CompaniesService)
    })

    it('should update a company successfully when te cnpj received not exists in the database', async () => {
        findOneBy.mockResolvedValueOnce(null)
        update.mockResolvedValueOnce({ affected: 1 })

        const updateRes = await service.update(1, jwtPayload.userId, mockCompanyValidCnpj)

        expect(updateRes).toEqual({ statusCode: 200, message: 'Company updated succesfully', content: [] })
    })

    it('should update a company successfully when te cnpj received exists in the database but is the company updating', async () => {
        findOneBy.mockResolvedValueOnce({ id: 1 })
        update.mockResolvedValueOnce({ affected: 1 })

        const updateRes = await service.update(1, jwtPayload.userId, mockCompanyValidCnpj)

        expect(updateRes).toEqual({ statusCode: 200, message: 'Company updated succesfully', content: [] })
    })

    it('should update a company successfully and call the funcion update of repository with the formatted cnpj', async () => {
        findOneBy.mockResolvedValueOnce({ id: 1 })
        update.mockResolvedValueOnce({ affected: 1 })
        clearNumberString.mockReturnValueOnce('123')

        await service.update(1, jwtPayload.userId, mockCompanyValidCnpj)

        expect(update).toBeCalledWith(
            { id: 1, user: { id: jwtPayload.userId } },
            { ...mockCompanyValidCnpj, cnpj: '123' }
        )
    })

    it('should update a company successfully and return an object that is instance of ResponseOk', async () => {
        findOneBy.mockResolvedValueOnce(null)
        update.mockResolvedValueOnce({ affected: 1 })

        const updateRes = await service.update(1, jwtPayload.userId, mockCompanyValidCnpj)

        expect(updateRes).toBeInstanceOf(ResponseOk)
    })

    it('should throw an DuplicatedUniqueKeyException when the cnpj already exists and are not the company updating', () => {
        const companyId = 4
        findOneBy.mockResolvedValueOnce({ id: 6 })

        expect(service.update(companyId, jwtPayload.userId, mockCompanyValidCnpj)).rejects.toThrow(DuplicatedUniqueKeyException)
    })

    it('should throw an EntityNotFoundException because the company not exists', async () => {
        findOneBy.mockResolvedValueOnce({ id: 1 })

        update.mockResolvedValueOnce({ affected: 0 })

        expect(service.update(1, jwtPayload.userId, mockCompanyValidCnpj)).rejects.toThrow(EntityNotFoundException)
    })

    it('should throw an InvalidCnpjException when pass an invalid cnpj', () => {
        findOneBy.mockResolvedValueOnce(null)
        expect(service.update(1, jwtPayload.userId, mockCompanyInvalidCnpj)).rejects.toThrow(InvalidCnpjException)
    })
})
