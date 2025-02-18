import { Task } from './tasks/task.entity';
import { Module, OnModuleInit } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

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
      logging: true, // Enable logging
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
