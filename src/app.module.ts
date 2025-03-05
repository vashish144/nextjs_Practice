import { Task } from './tasks/task.entity';
import { Module, OnModuleInit } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import {PassportModule} from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'task-management',
      autoLoadEntities: true,
      synchronize: true,
      logging: false, // Enable logging
    }),
    AuthModule,
    PassportModule.register({defaultStratgy:'jwt'}),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret', // Use environment variables for security
      signOptions: { expiresIn: '1h' }, // Set expiration for tokens
    }),
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    const isConnected = await this.dataSource.isInitialized;
    if (isConnected) {
      console.log('Database connection established successfully');
    } else {
      console.log('Failed to establish database connection');
    }
  }
}
