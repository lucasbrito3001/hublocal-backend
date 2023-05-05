import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthGuard } from 'src/resources/auth/auth.guard';
import { JwtPayload } from 'src/utils/custom/jwtParams.decorator';
import { MissingRequiredInformationException } from 'src/utils/custom/exceptions.custom';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('companies')
@UseGuards(AuthGuard)
@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }
    
    @Post()
    @ApiResponse({ status: 201, description: 'Created successfully' })
    @ApiResponse({ status: 400, description: 'Missing info or invalid cnpj' })
    @ApiResponse({ status: 409, description: 'Try to create the company with a cnpj that already exists' })
    async create(@Body() createCompanyDto: CreateCompanyDto, @JwtPayload() jwtPayload: any) {
        const { name, website, cnpj } = createCompanyDto

        if (!name || !website || !cnpj) throw new MissingRequiredInformationException('creating')

        return await this.companiesService.create(createCompanyDto, jwtPayload.userId);
    }

    @Get()
    @ApiResponse({ status: 200, description: 'The reading works' })
    async findAllByUser(@JwtPayload() jwtPayload: any) {
        return await this.companiesService.findAllByUser(jwtPayload.userId);
    }

    @Patch(':id')
    @ApiResponse({ status: 200, description: 'Updated successfully' })
    @ApiResponse({ status: 400, description: 'Missing informations or invalid cnpj or entity not found with the id sent' })
    @ApiResponse({ status: 409, description: 'Try to update the company with a cnpj that already exists' })
    async update(@Param('id') id: string, @JwtPayload() jwtPayload: any, @Body() updateCompanyDto: UpdateCompanyDto) {
        const { name, website, cnpj } = updateCompanyDto
        const { userId } = jwtPayload

        if (!name || !website || !cnpj) throw new MissingRequiredInformationException('updating')

        return await this.companiesService.update(+id, userId, updateCompanyDto);
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Deleted successfully' })
    @ApiResponse({ status: 400, description: 'Try to delete an entity that not exists' })
    async remove(@Param('id') id: string, @JwtPayload() jwtPayload: any) {
        const { userId } = jwtPayload
        return await this.companiesService.remove(+id, userId);
    }
}
