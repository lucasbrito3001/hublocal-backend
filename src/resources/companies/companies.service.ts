import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { cnpj as cnpjValidator } from 'cpf-cnpj-validator';
import { DuplicatedUniqueKeyException, EntityNotFoundException, ImposibleDeleteByRelationException, InvalidCnpjException } from 'src/utils/custom/exceptions.custom';
import { ResponseCreated, ResponseOk } from 'src/utils/types/responseOk.type';
import { UtilsService } from '../utils/utils.service';
import { LocationsService } from '../locations/locations.service';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectRepository(Company) private companiesRepository: Repository<Company>,
        private utilsService: UtilsService
    ) { }

    async create(createCompanyDto: CreateCompanyDto, userId: number): Promise<ResponseCreated> {
        const { name, website, cnpj } = createCompanyDto

        const isValidCnpj = cnpjValidator.isValid(cnpj)
        if(!isValidCnpj) throw new InvalidCnpjException()

        const company = await this.companiesRepository.findOneBy({ cnpj })
        if(company !== null) throw new DuplicatedUniqueKeyException('company', 'cnpj')

        const formattedCnpj = this.utilsService.clearNumberString(cnpj)

        await this.companiesRepository.save({ name, website, cnpj: formattedCnpj, user: { id: userId } })

        return new ResponseCreated('Company created successfully')
    }

    async findAllByUser(userId: number, page: number, rowsPerPage: number): Promise<ResponseOk> {
        const [companies, total] = await this.companiesRepository.findAndCount({ 
            where: { 
                user: { id: userId } 
            },
            order: { id: 'asc' },
            relations: ['locations'],
            loadRelationIds: true,
            skip: page * rowsPerPage,
            take: rowsPerPage
        })

        return new ResponseOk(
            companies.length > 0 ? 'ok' : "User has no companies", 
            companies, 
            { totalCompanies: total }
        )
    }

    async findOneByUser(id: number, userId: number): Promise<ResponseOk> {
        const company = await this.companiesRepository.findOneBy({ id,  user: { id: userId } })

        return new ResponseOk(company !== null ? 'ok' : "This company does not exist for this user", [company])
    }

    async update(id: number, userId: number, updateCompanyDto: UpdateCompanyDto): Promise<ResponseOk> {
        const { name, website, cnpj } = updateCompanyDto

        const isValidCnpj = cnpjValidator.isValid(cnpj)
        if(!isValidCnpj) throw new InvalidCnpjException()

        const company = await this.companiesRepository.findOneBy({ cnpj })
        if(company !== null && company.id !== id) throw new DuplicatedUniqueKeyException('company', 'cnpj')

        const formattedCnpj = this.utilsService.clearNumberString(cnpj)

        const { affected } = await this.companiesRepository.update(
            { id, user: { id: userId } },
            { name, website, cnpj: formattedCnpj }
        )
        if(affected === 0) throw new EntityNotFoundException('company', 'update')

        return new ResponseOk('Company updated succesfully')
    }

    async remove(id: number, userId: number): Promise<any> {
        const companyLocations = await this.companiesRepository.findOne({
            where: { id },
            relations: ['locations'],
            loadRelationIds: true
        })

        if(companyLocations?.locations.length > 0) throw new ImposibleDeleteByRelationException()

        const { affected } = await this.companiesRepository.delete({ id, user: { id: userId } })

        if(affected === 0) throw new EntityNotFoundException('company', 'delete')

        return new ResponseOk('Company deleted successfully')
    }
}
