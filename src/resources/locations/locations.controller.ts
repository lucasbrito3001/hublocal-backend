import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, Query, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto, createLocationSchema } from './dto/create-location.dto';
import { UpdateLocationDto, updateLocationSchema } from './dto/update-location.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { JwtPayloadAuthGuard } from 'src/utils/custom/decorators.custom';
import { JoiValidationPipe } from 'src/utils/custom/pipes.custom';
import { ResponseCreated } from 'src/utils/types/responseOk.type';
import { FindAllParams } from './locations.controller.params';

@ApiTags('locations')
@UseGuards(AuthGuard)
@Controller('locations')
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) { }

    @Post()
    @ApiResponse({ status: 201, description: 'Created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or missing info in request body' })
    @ApiResponse({ status: 403, description: 'The user does not have permission to create location for this company' })
    async create(
        @Body(new JoiValidationPipe(createLocationSchema)) createLocationDto: CreateLocationDto,
        @JwtPayloadAuthGuard() jwtPayload: any
    ): Promise<ResponseCreated> {
        const { userId } = jwtPayload
        return this.locationsService.create(createLocationDto, userId);
    }

    @Get()
    @ApiResponse({ status: 200, description: 'Read successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or missing query parameter companyId' })
    @ApiResponse({ status: 403, description: 'The user does not have permission to read infos for this company' })
    async findAllByCompany(
        @Query(new ValidationPipe({
            transform: true
        })) queryParams: FindAllParams,
        @JwtPayloadAuthGuard() jwtPayload: any
    ) {
        const { companyId, page, rowsPerPage } = queryParams;
        const { userId } = jwtPayload
        return this.locationsService.findAllByCompany(+companyId, userId, page, rowsPerPage);
    }

    @Patch(':id')
    @ApiResponse({ status: 200, description: 'Updated successfully' })
    @ApiResponse({ status: 400, description: 'Update failed because the location does not exists' })
    @ApiResponse({ status: 403, description: 'The user does not have permission to update location for this company' })
    async update(
        @Param('id') id: string,
        @Body(new JoiValidationPipe(updateLocationSchema)) updateLocationDto: UpdateLocationDto,
        @JwtPayloadAuthGuard() jwtPayload: any
    ) {
        const { userId } = jwtPayload
        return this.locationsService.update(+id, updateLocationDto, userId);
    }

    @Delete(':id')
    @ApiResponse({ status: 201, description: 'Deleted successfully' })
    @ApiResponse({ status: 400, description: 'Delete failed because the location does not exists' })
    @ApiResponse({ status: 403, description: 'The user does not have permission to delete location for this company' })
    async remove(
        @Param('id') id: string,
        @JwtPayloadAuthGuard() jwtPayload: any
    ) {
        const { userId } = jwtPayload;
        return this.locationsService.remove(+id, userId);
    }
}
