import { Test, TestingModule } from '@nestjs/testing'
import { LocationsController } from '../locations.controller'
import { LocationsService } from '../locations.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Location } from '../entities/location.entity'
import { JwtService } from '@nestjs/jwt'
import { MissingRequiredInformationException } from 'src/utils/custom/exceptions.custom'
import { CreateLocationDto } from '../dto/create-location.dto'
import { UpdateLocationDto } from '../dto/update-location.dto'

describe('LocationsController', () => {
    const helloWorldExample = { hello: 'world' }
    const jwtPayload = { "userId": 1, "userEmail": "mock@mock.com", "iat": 1683206041 }
    const queryParams = { companyId: 1, page: 0, rowsPerPage: 10 }
    const createLocationDto: CreateLocationDto = {
        name: 'mock',
        city: 'mock city',
        district: 'mock district',
        street: 'mock street',
        zipCode: '12345678',
        state: 'ms',
        number: 1,
        companyId: 1
    }
    const { companyId, ...updateLocationDto} = createLocationDto

    let controller: LocationsController

    let findAllByCompany: any
    let create: any
    let update: any
    let remove: any

    beforeEach(async () => {
        findAllByCompany = jest.fn()
        create = jest.fn()
        update = jest.fn()
        remove = jest.fn()

        const module: TestingModule = await Test.createTestingModule({
            controllers: [LocationsController],
            providers: [
                LocationsService,
                JwtService,
                {
                    provide: getRepositoryToken(Location),
                    useValue: {}
                },
            ]
        })
            .overrideProvider(LocationsService)
            .useValue({ findAllByCompany, create, update, remove })
            .compile()

        controller = module.get<LocationsController>(LocationsController)
    })

    it('should return the response received by the method create of the service', async () => {
        create.mockResolvedValueOnce(helloWorldExample)

        const responseCreate = await controller.create(createLocationDto, jwtPayload)

        expect(responseCreate).toEqual(helloWorldExample)
    })

    it('should return the response received by the method update of the service', async () => {
        update.mockResolvedValueOnce(helloWorldExample)

        const responseUpdate = await controller.update('1', updateLocationDto, jwtPayload)

        expect(responseUpdate).toEqual(helloWorldExample)
    })

    it('should return the response received by the method findAllByUser of the service', async () => {
        findAllByCompany.mockResolvedValueOnce(helloWorldExample)

        const responseFindAll = await controller.findAllByCompany(queryParams, jwtPayload)

        expect(responseFindAll).toEqual(helloWorldExample)
    })

    it('should return the response received by the method remove of the service', async () => {
        remove.mockResolvedValueOnce(helloWorldExample)

        const responseUpdate = await controller.remove('1', jwtPayload)

        expect(responseUpdate).toEqual(helloWorldExample)
    })
})
