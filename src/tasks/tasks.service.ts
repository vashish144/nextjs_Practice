import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { v7 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-taskes-filter.dto';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  // private tasks: Task[] = [];

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // getTaskWithFilter(filterDto:GetTaskFilterDto):Task[]{
  //   const {status,search}=filterDto;

  //   let tasks=this.getAllTasks();
  //   if(status){
  //       tasks=tasks.filter(task=>task.status===status)
  //   }
  //   if (search){
  //       tasks=tasks.filter(task=>{
  //           if(task.title.includes(search)||task.description.includes(search)){
  //               return true;
  //           }else{
  //               return false;
  //           }
  //       })
  //   }
  //   return tasks;
  // }

  // getTaskById(id: string): Task {
  //   const found= this.tasks.find((task) => task.id === id);
  //   if(!found){
  //       throw new NotFoundException(`Task with ID ${id} not found`);
  //   }
  //   return found;
  // }

  // deleteById(id: string): void {
  //    this.tasks.filter((task) => task.id !== id);
  // }

  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }

  // updateTaskStatus(id:string,status:TaskStatus){
  //   const task=this.getTaskById(id);
  //   task.status=status;
  //   return task;
  // }

  // note
  // replaced task.model.ts -> Task.enum.ts

  // *********connection with database****************

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.taskRepository.save(task);
    return task;
  }
}
