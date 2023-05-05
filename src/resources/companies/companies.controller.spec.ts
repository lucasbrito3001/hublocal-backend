import { Test, TestingModule } from '@nestjs/testing'
import { CompaniesController } from './companies.controller'
import { CompaniesService } from './companies.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Company } from './entities/company.entity'
import { JwtService } from '@nestjs/jwt'
import { MissingRequiredInformationException } from 'src/utils/custom/exceptions.custom'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'

describe('CompaniesController', () => {
    const helloWorldExample = { hello: 'world' }

    const mockAuthGuard = {
        CanActivate: jest.fn(() => true)
    }

    const jwtPayload = {
        "userId": 1,
        "userEmail": "mock@mock.com",
        "iat": 1683206041
    }

    let controller: CompaniesController

    let findAllByUser:any
    let create: any
    let update: any
    let remove: any

    beforeEach(async () => {
        findAllByUser = jest.fn()
        create = jest.fn()
        update = jest.fn()
        remove = jest.fn()

        const module: TestingModule = await Test.createTestingModule({
            controllers: [CompaniesController],
            providers: [
                CompaniesService,
                JwtService,
                {
                    provide: getRepositoryToken(Company),
                    useValue: {}
                },
            ]
        })
        .overrideProvider(CompaniesService)
        .useValue({ findAllByUser, create, update, remove })
        .compile()

        controller = module.get<CompaniesController>(CompaniesController)
    })

    it('should return the response received by the method create of the service',
        async () => {
            create.mockResolvedValueOnce(helloWorldExample)
            const createCompanyDto = { name: 'mock', website: 'mock.com', cnpj: 'any' }

            const responseCreate = await controller.create(createCompanyDto, jwtPayload)

            expect(responseCreate).toEqual(helloWorldExample)
        }
    )

    it('should throw MissingRequiredInformationException when try to create a company sending the request missing info', 
        () => {
            const createCompanyDto = {} as CreateCompanyDto
            expect(controller.create(createCompanyDto, jwtPayload)).rejects.toThrow(MissingRequiredInformationException)
        }
    )

    it('should return the response received by the method update of the service',
        async () => {
            update.mockResolvedValueOnce(helloWorldExample)
            const updateCompanyDto = { name: 'mock', website: 'mock.com', cnpj: 'any' }

            const responseUpdate = await controller.update('1', jwtPayload, updateCompanyDto)

            expect(responseUpdate).toEqual(helloWorldExample)
        }
    )

    it('should throw MissingRequiredInformationException when try to update a company sending the request missing info', 
        () => {
            const updateCompanyDto = { name: 'mock' } as UpdateCompanyDto

            expect(controller.update('1', jwtPayload, updateCompanyDto)).rejects.toThrow(MissingRequiredInformationException)
        }
    )

    it('should return the response received by the method findAllByUser of the service',
        async () => {
            findAllByUser.mockResolvedValueOnce(helloWorldExample)

            const responseFindAll = await controller.findAllByUser(jwtPayload)

            expect(responseFindAll).toEqual(helloWorldExample)
        }
    )

    it('should return the response received by the method remove of the service',
        async () => {
            remove.mockResolvedValueOnce(helloWorldExample)

            const responseUpdate = await controller.remove('1', jwtPayload)

            expect(responseUpdate).toEqual(helloWorldExample)
        }
    )
})
