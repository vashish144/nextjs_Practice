import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskRepository } from './tasks.repository';
import { Task } from './task.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]),AuthModule], // Only register the entity
  controllers: [TasksController],
  providers: [TasksService, TaskRepository], // Register TaskRepository as a provider
  exports: [TasksService, TaskRepository], // Export it properly
})
export class TasksModule {}
