import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { v7 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-taskes-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { log } from 'console';
@Injectable()
export class TasksService {
  private logger = new Logger('Tasks');
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) { }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id } });
    this.logger.debug(`Task with ID ${id} not found`);
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
    try {
      await this.taskRepository.save(task);
    } catch (error) {
      this.logger.error(`Error in saving task ${error}`,error.stack);
    }

    return task;
  }
  async deleteById(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }

  async getAllTasks(): Promise<Task[]> {
    const found = await this.taskRepository.find();
    this.logger.verbose(`Task found ${found}`);
    return found;
  }

  async getTaskWithFilter(filterDto: GetTaskFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    let tasks = await this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }
    return tasks;
  }
}
