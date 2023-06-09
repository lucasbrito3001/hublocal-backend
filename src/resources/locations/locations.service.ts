import { ForbiddenException, Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ResponseCreated, ResponseOk } from 'src/utils/types/responseOk.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';
import { CompaniesService } from '../companies/companies.service';
import { EntityNotFoundException } from 'src/utils/custom/exceptions.custom';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class LocationsService {
    constructor(
        @InjectRepository(Location) private locationsRepository: Repository<Location>,
        private utilsService: UtilsService,
        @Inject(forwardRef(() => CompaniesService))
        private companiesService: CompaniesService
    ) { }

    async create(createLocationDto: CreateLocationDto, userId: number) {
        const { companyId, ...locationInfos } = createLocationDto

        const company = await this.companiesService.findOneByUser(companyId, userId)

        if(company.content[0] === null) throw new ForbiddenException("This company does not exist for this user")

        locationInfos.zipCode = this.utilsService.clearNumberString(locationInfos.zipCode)

        await this.locationsRepository.save({ ...{ ...locationInfos }, company: { id: companyId } })
        
        return new ResponseCreated('Location created successfully')
    }

    async findAllByCompany(companyId: number, userId: number, page: number, rowsPerPage: number) {
        const company = await this.companiesService.findOneByUser(companyId, userId)

        if(company.content[0] === null) throw new ForbiddenException("This company does not exist for this user")

        const [locations, total] = await this.locationsRepository.findAndCount({
            where: { company: { id: companyId } },
            order: { id: 'asc' },
            take: rowsPerPage,
            skip: page * rowsPerPage
        })

        return new ResponseOk(locations.length > 0 ? 'ok' : 'This company has no locations', locations, { totalLocations: total })
    }

    async findOne(id: number) {
        const location = await this.locationsRepository.findOneBy({ id })
        return new ResponseOk(location !== null ? 'ok' : 'Location not found', [location])
    }

    async update(id: number, updateLocationDto: UpdateLocationDto, userId: number) {
        const { companyId, ...locationInfos } = updateLocationDto

        const company = await this.companiesService.findOneByUser(companyId, userId)
        if(company.content[0] === null) throw new ForbiddenException("This company does not exist for this user")

        const { affected } = await this.locationsRepository.update(id, locationInfos)
        if(affected === 0) throw new EntityNotFoundException('location', 'update')

        return new ResponseOk('Location updated successfully')
    }

    async remove(id: number, userId: number) {
        const resultFindOne = await this.findOne(id)
        if(resultFindOne.content[0] === null) throw new EntityNotFoundException('location', 'delete')
        
        const company = await this.companiesService.findOneByUser(resultFindOne.content[0].companyId, userId)
        if(company.content[0] === null) throw new ForbiddenException("This company does not exist for this user")

        await this.locationsRepository.delete(id)

        return new ResponseOk('Location deleted successfully')
    }
}
