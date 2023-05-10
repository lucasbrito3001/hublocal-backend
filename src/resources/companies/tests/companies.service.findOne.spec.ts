import { Test, TestingModule } from '@nestjs/testing'
import { CompaniesService } from '../companies.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Company } from '../entities/company.entity'
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

    let service: CompaniesService

    beforeEach(async () => {
        findOneBy = jest.fn()

        const mockRepository = { findOneBy }

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

    it('should read one by id filtering by user succesfully', async () => {
        const id = 1
        findOneBy.mockResolvedValueOnce({ id })
    
        const resultFindOneByUser = await service.findOneByUser(id, jwtPayload.userId)
    
        expect(resultFindOneByUser).toEqual(new ResponseOk('ok', [{id}]))
    })
    
    it('should return a message saying that this company does not exist for this user', async () => {
        const id = 1
        findOneBy.mockResolvedValueOnce(null)
    
        const resultFindOneByUser = await service.findOneByUser(id, jwtPayload.userId)
    
        expect(resultFindOneByUser).toEqual(new ResponseOk("This company does not exist for this user", [null]))
    })
})
