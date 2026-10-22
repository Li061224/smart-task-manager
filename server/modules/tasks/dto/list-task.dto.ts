import { IsIn, IsOptional, IsString } from 'class-validator';
import type { TaskListQuery, TaskPriority } from '@shared/api.interface';

export class ListTaskDto implements TaskListQuery {
  @IsOptional()
  @IsString()
  @IsIn(['high', 'medium', 'low'])
  priority?: 'high' | 'medium' | 'low';
}
