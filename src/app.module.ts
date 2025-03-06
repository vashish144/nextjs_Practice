import { Task } from './tasks/task.entity';
import { Module, OnModuleInit } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
        logging: false, // Enable logging
      })

    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'root',
    //   database: 'task-management',
    //   autoLoadEntities: true,
    //   synchronize: true,
    //   logging: false, // Enable logging
    // }),
    AuthModule,
    PassportModule.register({ defaultStratgy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret', // Use environment variables for security
      signOptions: { expiresIn: '1h' }, // Set expiration for tokens
    }),
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) { }

  async onModuleInit() {
    const isConnected = await this.dataSource.isInitialized;
    if (isConnected) {
      console.log('Database connection established successfully');
    } else {
      console.log('Failed to establish database connection');
    }
  }
}
