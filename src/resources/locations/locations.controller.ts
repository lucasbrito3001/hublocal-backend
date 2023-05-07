import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, Query, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto, createLocationSchema } from './dto/create-location.dto';
import { UpdateLocationDto, updateLocationSchema } from './dto/update-location.dto';
import { ApiTags } from '@nestjs/swagger';
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
    async create(
        @Body(new JoiValidationPipe(createLocationSchema)) createLocationDto: CreateLocationDto,
        @JwtPayloadAuthGuard() jwtPayload: any
    ): Promise<ResponseCreated> {
        const { userId } = jwtPayload
        return this.locationsService.create(createLocationDto, userId);
    }

    @Get()
    async findAllByCompany(
        @Query(new ValidationPipe({
            transform: true
        })) queryParams: FindAllParams,
        @JwtPayloadAuthGuard() jwtPayload: any
    ) {
        const { companyId } = queryParams;
        const { userId } = jwtPayload
        return this.locationsService.findAllByCompany(userId, +companyId);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body(new JoiValidationPipe(updateLocationSchema)) updateLocationDto: UpdateLocationDto,
        @JwtPayloadAuthGuard() jwtPayload: any
    ) {
        const { userId } = jwtPayload
        return this.locationsService.update(+id, updateLocationDto, userId);
    }

    @Delete(':id')
    async remove(
        @Param('id') id: string,
        @JwtPayloadAuthGuard() jwtPayload: any
    ) {
        const { userId } = jwtPayload;
        return this.locationsService.remove(+id, userId);
    }
}
