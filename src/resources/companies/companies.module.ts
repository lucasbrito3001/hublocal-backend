import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { UtilsService } from '../utils/utils.service';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [CompaniesController],
  providers: [CompaniesService, UtilsService],
  exports: [CompaniesService]
})
export class CompaniesModule {}
