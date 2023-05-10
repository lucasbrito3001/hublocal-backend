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

    let findAndCount: any

    let service: CompaniesService

    beforeEach(async () => {
        findAndCount = jest.fn()

        const mockRepository = { findAndCount }

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
            .overrideProvider(UtilsService).useValue({})
            .compile()

        service = module.get<CompaniesService>(CompaniesService)
    })

    it('should read users by the userId successfully and return them', async () => {
        const company = new Company('mock', 'mock.com', '00000000000000')
        findAndCount.mockResolvedValueOnce([[company], 10])

        const resultFindAllByUser = await service.findAllByUser(1, 0, 10)

        expect(resultFindAllByUser).toEqual({
            statusCode: 200,
            message: 'ok',
            content: [company],
            extra: { totalCompanies: 10 }
        })
    })

    it('should call the method find of the repository with the value passed from service', async () => {
        const userId = 10
        const company = new Company('mock', 'mock.com', '00000000000000')
        findAndCount.mockResolvedValueOnce([company])

        await service.findAllByUser(userId, 2, 10)

        expect(findAndCount).toBeCalledWith({
            where: { user: { id: userId } },
            order: { id: 'asc' },
            relations: ['locations'],
            loadRelationIds: true,
            take: 10,
            skip: 20
        })
    })
})
