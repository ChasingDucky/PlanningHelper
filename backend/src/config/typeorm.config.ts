import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(__dirname, '../../../.env') });

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'planning_user',
  password: process.env.DB_PASSWORD || 'planning_pass',
  database: process.env.DB_DATABASE || 'planning_helper',
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
  // Enable auto-sync for development and Docker demo environments
  // In true production, use migrations instead
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
};

// DataSource for TypeORM CLI
export default new DataSource(typeOrmConfig);
