import { Module } from '@nestjs/common';
import { UsersModule } from './resources/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './utils/config/config.service';
import { AuthModule } from './resources/auth/auth.module';
import { LocationsModule } from './resources/locations/locations.module';
import { CompaniesModule } from './resources/companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UsersModule,
    AuthModule,
    LocationsModule,
    CompaniesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
