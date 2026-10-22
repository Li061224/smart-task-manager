import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { NeedLogin } from '@lark-apaas/fullstack-nestjs-core';
import type { Request } from 'express';

import type { Task } from '@shared/api.interface';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ListTaskDto } from './dto/list-task.dto';

@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @NeedLogin()
  @Get()
  async list(@Query() query: ListTaskDto): Promise<Task[]> {
    return this.tasksService.findAll(query.priority);
  }

  @NeedLogin()
  @Post()
  async create(@Req() req: Request, @Body() dto: CreateTaskDto): Promise<Task> {
    const { userId } = req.userContext;
    return this.tasksService.create({ ...dto, createdBy: userId });
  }

  @NeedLogin()
  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<Task> {
    const { userId } = req.userContext;
    return this.tasksService.update(id, { ...dto, updatedBy: userId });
  }

  @NeedLogin()
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.tasksService.delete(id);
  }
}
