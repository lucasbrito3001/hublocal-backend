import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ValidationPipe } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthGuard } from 'src/resources/auth/auth.guard';
import { JwtPayloadAuthGuard } from 'src/utils/custom/decorators.custom';
import { MissingRequiredInformationException } from 'src/utils/custom/exceptions.custom';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindAllParams } from './companies.controller.params';

@ApiTags('companies')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }
    
    @Post()
    @ApiResponse({ status: 201, description: 'Created successfully' })
    @ApiResponse({ status: 400, description: 'Missing info or invalid cnpj' })
    @ApiResponse({ status: 403, description: "The user don't have permission to do this" })
    @ApiResponse({ status: 409, description: 'Try to create the company with a cnpj that already exists' })
    async create(@Body() createCompanyDto: CreateCompanyDto, @JwtPayloadAuthGuard() jwtPayload: any) {
        const { name, website, cnpj } = createCompanyDto

        if (!name || !website || !cnpj) throw new MissingRequiredInformationException('creating')

        return await this.companiesService.create(createCompanyDto, jwtPayload.userId);
    }

    @Get()
    @ApiResponse({ status: 200, description: 'The reading works' })
    @ApiResponse({ status: 401, description: "The user isn't authenticated" })
    @ApiResponse({ status: 403, description: "The user don't have permission to do this" })
    async findAllByUser(
        @JwtPayloadAuthGuard() jwtPayload: any,
        @Query(new ValidationPipe({
            transform: true
        })) queryParams: FindAllParams
    ) {
        const { page, rowsPerPage } = queryParams
        const res = await this.companiesService.findAllByUser(jwtPayload.userId, page, rowsPerPage);

        res.content = res.content.map(company => {
            const { locations, ...companyInfos } = company
            companyInfos.quantityLocations = company.locations.length
            return companyInfos
        })

        return res
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Read company successfully' })
    @ApiResponse({ status: 401, description: "The user isn't authenticated" })
    @ApiResponse({ status: 403, description: "The user don't have permission to do this" })
    async findById(@Param('id') id: string, @JwtPayloadAuthGuard() jwtPayload: any) {
        const { userId } = jwtPayload
        return await this.companiesService.findOneByUser(+id, userId)
    }

    @Patch(':id')
    @ApiResponse({ status: 200, description: 'Updated successfully' })
    @ApiResponse({ status: 400, description: 'Missing informations or invalid cnpj or entity not found with the id sent' })
    @ApiResponse({ status: 401, description: "The user isn't authenticated" })
    @ApiResponse({ status: 403, description: "The user don't have permission to do this" })
    @ApiResponse({ status: 409, description: 'Try to update the company with a cnpj that already exists' })
    async update(@Param('id') id: string, @JwtPayloadAuthGuard() jwtPayload: any, @Body() updateCompanyDto: UpdateCompanyDto) {
        const { name, website, cnpj } = updateCompanyDto
        const { userId } = jwtPayload

        if (!name || !website || !cnpj) throw new MissingRequiredInformationException('updating')

        return await this.companiesService.update(+id, userId, updateCompanyDto);
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Deleted successfully' })
    @ApiResponse({ status: 400, description: 'Try to delete an entity that not exists' })
    @ApiResponse({ status: 401, description: "The user isn't authenticated" })
    @ApiResponse({ status: 403, description: "The user don't have permission to do this" })
    async remove(@Param('id') id: string, @JwtPayloadAuthGuard() jwtPayload: any) {
        const { userId } = jwtPayload
        return await this.companiesService.remove(+id, userId);
    }
}
