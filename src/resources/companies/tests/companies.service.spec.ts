import { Test, TestingModule } from '@nestjs/testing'
import { CompaniesService } from '../companies.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Company } from '../entities/company.entity'
import { DuplicatedUniqueKeyException, EntityNotFoundException, InvalidCnpjException, MissingRequiredInformationException } from 'src/utils/custom/exceptions.custom'
import { ResponseOk } from 'src/utils/types/responseOk.type'

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
    let find: any
    let update: any
    let deleteFn: any

    let service: CompaniesService

    beforeEach(async () => {
        save = jest.fn()
        find = jest.fn()
        findOneBy = jest.fn()
        update = jest.fn()
        deleteFn = jest.fn()

        const mockRepository = { save, find, findOneBy, update, delete: deleteFn }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CompaniesService,
                {
                    provide: getRepositoryToken(Company),
                    useValue: mockRepository
                }
            ],
        }).compile()

        service = module.get<CompaniesService>(CompaniesService)
    })

    it('should create a company successfully',
        async () => {
            save.mockResolvedValueOnce(true)
            findOneBy.mockResolvedValueOnce(null)

            const res = await service.create(mockCompanyValidCnpj, 1)

            expect(findOneBy).toBeCalled()
            expect(save).toBeCalledWith({ ...mockCompanyValidCnpj, user: { id: 1 } })
            expect(res).toEqual({ statusCode: 201, message: 'Company created successfully' })
        }
    )

    it('should throw an InvalidCnpjException when receive an invalid cnpj',
        () => {
            expect(service.create(mockCompanyInvalidCnpj, 1)).rejects.toThrow(InvalidCnpjException)
        }
    )

    it('should not call the methods findOneBy and save of the repository',
        async () => {
            try {
                await service.create(mockCompanyInvalidCnpj, 1)
            } catch (error) {
                expect(findOneBy).not.toBeCalled()
                expect(save).not.toBeCalled()
            }
        }
    )

    it('should throw a DuplicatedUniqueKeyException when try to create a company with duplicated cnpj',
        () => {
            expect(service.create(mockCompanyValidCnpj, 1)).rejects.toThrow(DuplicatedUniqueKeyException)
        }
    )

    it('should call the method findOneBy and not the save of the repository when try to create a company with duplicated cnpj',
        async () => {
            try {
                await service.create(mockCompanyValidCnpj, 1)
            } catch (error) {
                expect(findOneBy).toBeCalled()
                expect(save).not.toBeCalled()
            }
        }
    )

    it('should read users by the userId successfully and return them',
        async () => {
            const company = new Company('mock', 'mock.com', '00000000000000')
            find.mockResolvedValueOnce([company])

            const resultFindAllByUser = await service.findAllByUser(1)

            expect(resultFindAllByUser).toEqual({ statusCode: 200, message: 'ok', content: [company] })
        }
    )

    it('should call the method find of the repository with the value passed from service',
        async () => {
            const userId = 10
            const company = new Company('mock', 'mock.com', '00000000000000')
            find.mockResolvedValueOnce([company])

            await service.findAllByUser(userId)

            expect(find).toBeCalledWith({ where: { user: { id: userId } } })
        }
    )

    it('should read the company succesfully', async () => {
        
    })

    it('should update a company successfully when te cnpj received not exists in the database',
        async () => {
            findOneBy.mockResolvedValueOnce(null)
            update.mockResolvedValueOnce({ affected: 1 })

            const updateRes = await service.update(1, jwtPayload.userId, mockCompanyValidCnpj)
            
            expect(updateRes).toEqual({ statusCode: 200, message: 'Company updated succesfully', content: [] })
        }
    )

    it('should update a company successfully when te cnpj received exists in the database but is the company updating',
        async () => {
            findOneBy.mockResolvedValueOnce({ id: 1 })
            update.mockResolvedValueOnce({ affected: 1 })

            const updateRes = await service.update(1, jwtPayload.userId, mockCompanyValidCnpj)
            
            expect(updateRes).toEqual({ statusCode: 200, message: 'Company updated succesfully', content: [] })
        }
    )

    it('should update a company successfully and return an object that is instance of ResponseOk',
        async () => {
            findOneBy.mockResolvedValueOnce(null)
            update.mockResolvedValueOnce({ affected: 1 })

            const updateRes = await service.update(1, jwtPayload.userId, mockCompanyValidCnpj)

            expect(updateRes).toBeInstanceOf(ResponseOk)
        }
    )

    it('should throw an DuplicatedUniqueKeyException when the cnpj already exists and are not the company updating',
        () => {
            const companyId = 4
            findOneBy.mockResolvedValueOnce({ id: 6 })

            expect(service.update(companyId, jwtPayload.userId, mockCompanyValidCnpj)).rejects.toThrow(DuplicatedUniqueKeyException)
        }
    )

    it('should throw an EntityNotFoundException because the company not exists',
        async () => {
            findOneBy.mockResolvedValueOnce({ id: 1 })

            update.mockResolvedValueOnce({ affected: 0 })

            expect(service.update(1, jwtPayload.userId, mockCompanyValidCnpj)).rejects.toThrow(EntityNotFoundException)
        }
    )

    it('should throw an InvalidCnpjException when pass an invalid cnpj',
        () => {
            findOneBy.mockResolvedValueOnce(null)
            expect(service.update(1, jwtPayload.userId, mockCompanyInvalidCnpj)).rejects.toThrow(InvalidCnpjException)
        }
    )

    it('should delete a company successfully',
        async () => {
            deleteFn.mockResolvedValueOnce({ affected: 1 })

            const responseDelete = await service.remove(1, jwtPayload.userId)

            expect(responseDelete).toBeInstanceOf(ResponseOk)
        }
    )

    it('should throw an EntityNotFoundException because the company not exists',
        async () => {
            deleteFn.mockResolvedValueOnce({ affected: 0 })

            expect(service.remove(1, jwtPayload.userId)).rejects.toThrow(EntityNotFoundException)
        }
    )

    it('should call the repository method with userId and idCompany',
        async () => {
            deleteFn.mockResolvedValueOnce({ affected: 1 })

            await service.remove(1, jwtPayload.userId)

            expect(deleteFn).toHaveBeenCalledWith({ id: 1, user: { id: jwtPayload.userId } })
        }
    )
})
