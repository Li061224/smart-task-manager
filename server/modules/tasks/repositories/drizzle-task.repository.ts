import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DRIZZLE_DATABASE, type PostgresJsDatabase } from '@lark-apaas/fullstack-nestjs-core';
import { eq, desc } from 'drizzle-orm';

import { tasks } from '@server/database/schema';
import type { Task, TaskPriority } from '@shared/api.interface';
import { TaskRepository } from './task.repository';

type TaskSelect = typeof tasks.$inferSelect;

function toTask(row: TaskSelect): Task {
  return {
    id: row.id,
    title: row.title,
    priority: row.priority as TaskPriority,
    completed: row.completed,
    createdAt: row.createdAt.toISOString(),
  };
}

@Injectable()
export class DrizzleTaskRepository implements TaskRepository {
  constructor(
    @Inject(DRIZZLE_DATABASE) private readonly db: PostgresJsDatabase,
  ) {}

  async findAll(priority?: TaskPriority): Promise<Task[]> {
    const query = priority
      ? this.db.select().from(tasks).where(eq(tasks.priority, priority)).orderBy(desc(tasks.createdAt))
      : this.db.select().from(tasks).orderBy(desc(tasks.createdAt));
    const rows: TaskSelect[] = await query;
    return rows.map(toTask);
  }

  async findById(id: string): Promise<Task | null> {
    const rows: TaskSelect[] = await this.db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    return rows.length > 0 ? toTask(rows[0]) : null;
  }

  async create(data: { title: string; priority: TaskPriority; createdBy: string }): Promise<Task> {
    const rows: TaskSelect[] = await this.db
      .insert(tasks)
      .values({
        title: data.title,
        priority: data.priority,
        createdBy: data.createdBy,
        updatedBy: data.createdBy,
      })
      .returning();
    return toTask(rows[0]);
  }

  async update(id: string, data: {
    title?: string;
    priority?: TaskPriority;
    completed?: boolean;
    updatedBy: string;
  }): Promise<Task> {
    const patch: Partial<typeof tasks.$inferInsert> = {};
    if (data.title !== undefined) patch.title = data.title;
    if (data.priority !== undefined) patch.priority = data.priority;
    if (data.completed !== undefined) patch.completed = data.completed;
    patch.updatedAt = new Date();
    patch.updatedBy = data.updatedBy;

    const rows: TaskSelect[] = await this.db
      .update(tasks)
      .set(patch)
      .where(eq(tasks.id, id))
      .returning();

    if (rows.length === 0) {
      throw new NotFoundException('任务不存在');
    }
    return toTask(rows[0]);
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.db.delete(tasks).where(eq(tasks.id, id)).returning({ id: tasks.id });
    if (deleted.length === 0) {
      throw new NotFoundException('任务不存在');
    }
  }
}
