import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { CompaniesModule } from '../companies/companies.module';
import { Location } from './entities/location.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsService } from '../utils/utils.service';

@Module({
    imports: [TypeOrmModule.forFeature([Location]), CompaniesModule],
    controllers: [LocationsController],
    providers: [LocationsService, UtilsService],
})
export class LocationsModule {}
