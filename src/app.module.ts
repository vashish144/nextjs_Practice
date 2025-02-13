import { Task } from './tasks/task.entity';
import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TasksModule,TypeOrmModule.forRoot({
    type:'postgres',
    host:'localhost',
    port:5432,
    username:'postgres',
    password:'root',
    database:'task-management',
    // entities: [Task],
    autoLoadEntities:true,
    synchronize:true
  })],
})
export class AppModule {}
