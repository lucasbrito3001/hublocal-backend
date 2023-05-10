import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

require('dotenv').config();

class ConfigService {
    constructor(private env: { [k: string]: string | undefined }) { }

    private getValue(key: string, throwOnMissing = true): string {
        const value = this.env[key];
        if (!value && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`);
        }

        return value;
    }

    public ensureValues(keys: string[]) {
        keys.forEach(key => this.getValue(key, true));
        return this;
    }

    public getPort() {
        return this.getValue('PORT');
    }

    public isProduction() {
        return this.getValue('MODE', false) != 'DEV';
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            entities: [join(__dirname, '..', '..', 'resources', '**', '*.entity{.ts,.js}')],
            // // migrationsTableName: 'migration',
            // // migrations: ['src/migration/*.ts'],
            ssl: this.isProduction(),
            synchronize: true,
            url: this.getValue('DB_URL_CONNECTION')
        };
    }

    public getJwtSecret(): string {
        return this.getValue('JWT_SECRET')
    }

}

const configService = new ConfigService(process.env)
    .ensureValues([
        'DB_URL_CONNECTION',
        'JWT_SECRET'
    ]);

export { configService };