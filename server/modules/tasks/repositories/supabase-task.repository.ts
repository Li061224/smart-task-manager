import { TaskRepository } from './task.repository';
import type { Task, TaskPriority } from '@shared/api.interface';

/**
 * Supabase TaskRepository 占位实现。
 *
 * 未来接入 Supabase 时：
 * 1. 安装 @supabase/supabase-js 并配置连接
 * 2. 实现下方所有方法，用 Supabase client 替换 Drizzle 调用
 * 3. 在 tasks.module.ts 中将 provider 从 DrizzleTaskRepository 换成本类：
 *    { provide: TaskRepository, useClass: SupabaseTaskRepository }
 * 4. Service 与 Controller 层无需任何改动。
 */
export class SupabaseTaskRepository implements TaskRepository {
  async findAll(_priority?: TaskPriority): Promise<Task[]> {
    throw new Error('SupabaseTaskRepository not implemented yet');
  }

  async findById(_id: string): Promise<Task | null> {
    throw new Error('SupabaseTaskRepository not implemented yet');
  }

  async create(_data: { title: string; priority: TaskPriority; createdBy: string }): Promise<Task> {
    throw new Error('SupabaseTaskRepository not implemented yet');
  }

  async update(
    _id: string,
    _data: { title?: string; priority?: TaskPriority; completed?: boolean; updatedBy: string },
  ): Promise<Task> {
    throw new Error('SupabaseTaskRepository not implemented yet');
  }

  async delete(_id: string): Promise<void> {
    throw new Error('SupabaseTaskRepository not implemented yet');
  }
}
