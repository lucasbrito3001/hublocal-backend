import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { cnpj, cnpj as cnpjValidator } from 'cpf-cnpj-validator';
import { DuplicatedUniqueKeyException, EntityNotFoundException, InvalidCnpjException } from 'src/utils/custom/exceptions.custom';
import { ResponseCreated, ResponseOk } from 'src/utils/types/responseOk.type';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectRepository(Company) private companiesRepository: Repository<Company>
    ) { }

    async create(createCompanyDto: CreateCompanyDto, userId: number): Promise<ResponseCreated> {
        const { name, website, cnpj } = createCompanyDto

        const isValidCnpj = cnpjValidator.isValid(cnpj)
        if(!isValidCnpj) throw new InvalidCnpjException()

        const company = await this.companiesRepository.findOneBy({ cnpj })
        if(company !== null) throw new DuplicatedUniqueKeyException('company', 'cnpj')

        await this.companiesRepository.save({ name, website, cnpj, user: { id: userId } })

        return new ResponseCreated('Company created successfully')
    }

    async findAllByUser(userId: number): Promise<ResponseOk> {
        const companies = await this.companiesRepository.find({ where: { 
            user: { id: userId } 
        }})

        return new ResponseOk(companies.length > 0 ? 'ok' : "User don't have companies", companies)
    }

    async update(id: number, userId: number, updateCompanyDto: UpdateCompanyDto): Promise<ResponseOk> {
        const { name, website, cnpj } = updateCompanyDto

        const isValidCnpj = cnpjValidator.isValid(cnpj)
        if(!isValidCnpj) throw new InvalidCnpjException()

        const company = await this.companiesRepository.findOneBy({ cnpj })

        console.log(company)

        if(company !== null && company.id !== id) throw new DuplicatedUniqueKeyException('company', 'cnpj')

        const { affected } = await this.companiesRepository.update({ id, user: { id: userId } }, { name, website, cnpj })

        if(affected === 0) throw new EntityNotFoundException('company', 'update')

        return new ResponseOk('Company updated succesfully')
    }

    async remove(id: number, userId: number): Promise<any> {
        const { affected } = await this.companiesRepository.delete({ id, user: { id: userId } })

        if(affected === 0) throw new EntityNotFoundException('company', 'delete')

        return new ResponseOk('Company deleted successfully')
    }
}
