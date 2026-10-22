import { IsIn, IsString, MaxLength, IsNotEmpty } from 'class-validator';
import type { CreateTaskRequest, TaskPriority } from '@shared/api.interface';

export class CreateTaskDto implements CreateTaskRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsIn(['high', 'medium', 'low'])
  priority!: 'high' | 'medium' | 'low';
}
