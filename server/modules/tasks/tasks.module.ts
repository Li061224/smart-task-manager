import { Module } from '@nestjs/common';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskRepository } from './repositories/task.repository';
import { DrizzleTaskRepository } from './repositories/drizzle-task.repository';

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: TaskRepository,
      useClass: DrizzleTaskRepository,
    },
  ],
})
export class TasksModule {}
