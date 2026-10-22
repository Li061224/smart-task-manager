import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { Task, TaskPriority } from '@shared/api.interface';
import { TaskRepository } from './repositories/task.repository';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TaskRepository) private readonly taskRepository: TaskRepository,
  ) {}

  async findAll(priority?: TaskPriority): Promise<Task[]> {
    return this.taskRepository.findAll(priority);
  }

  async findById(id: string): Promise<Task> {
    const task: Task | null = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException('任务不存在');
    }
    return task;
  }

  async create(data: { title: string; priority: TaskPriority; createdBy: string }): Promise<Task> {
    return this.taskRepository.create(data);
  }

  async update(id: string, data: {
    title?: string;
    priority?: TaskPriority;
    completed?: boolean;
    updatedBy: string;
  }): Promise<Task> {
    return this.taskRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
