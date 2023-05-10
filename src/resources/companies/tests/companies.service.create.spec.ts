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

    let save: any
    let findOneBy: any
    let clearNumberString: any

    let service: CompaniesService

    beforeEach(async () => {
        save = jest.fn()
        findOneBy = jest.fn()
        clearNumberString = jest.fn()

        const mockRepository = { save, findOneBy }

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

    it('should create a company successfully',
        async () => {
            save.mockResolvedValueOnce(true)
            findOneBy.mockResolvedValueOnce(null)
            clearNumberString.mockReturnValueOnce('123')

            const res = await service.create(mockCompanyValidCnpj, 1)

            expect(findOneBy).toBeCalled()
            expect(save).toBeCalledWith({ ...{ ...mockCompanyValidCnpj, cnpj: '123' }, user: { id: 1 } })
            expect(res).toEqual({ statusCode: 201, message: 'Company created successfully' })
        }
    )

    it('should throw an InvalidCnpjException when receive an invalid cnpj', () => {
        expect(service.create(mockCompanyInvalidCnpj, 1)).rejects.toThrow(InvalidCnpjException)
    })

    it('should not call the methods findOneBy and save of the repository', async () => {
        try {
            await service.create(mockCompanyInvalidCnpj, 1)
        } catch (error) {
            expect(findOneBy).not.toBeCalled()
            expect(save).not.toBeCalled()
        }
    })

    it('should throw a DuplicatedUniqueKeyException when try to create a company with duplicated cnpj', () => {
        expect(service.create(mockCompanyValidCnpj, 1)).rejects.toThrow(DuplicatedUniqueKeyException)
    })

    it('should call the method findOneBy and not the save of the repository when try to create a company with duplicated cnpj', async () => {
        try {
            await service.create(mockCompanyValidCnpj, 1)
        } catch (error) {
            expect(findOneBy).toBeCalled()
            expect(save).not.toBeCalled()
            expect(clearNumberString).not.toBeCalled()
        }
    })
})
