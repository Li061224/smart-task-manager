import { IsBoolean, IsIn, IsOptional, IsString, MaxLength, IsNotEmpty } from 'class-validator';
import type { UpdateTaskRequest, TaskPriority } from '@shared/api.interface';

export class UpdateTaskDto implements UpdateTaskRequest {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @IsIn(['high', 'medium', 'low'])
  priority?: 'high' | 'medium' | 'low';

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
