import type { Task, TaskPriority } from '@shared/api.interface';

export const TaskRepository = Symbol('TaskRepository');

export interface TaskRepository {
  findAll(priority?: TaskPriority): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  create(data: { title: string; priority: TaskPriority; createdBy: string }): Promise<Task>;
  update(id: string, data: {
    title?: string;
    priority?: TaskPriority;
    completed?: boolean;
    updatedBy: string;
  }): Promise<Task>;
  delete(id: string): Promise<void>;
}
