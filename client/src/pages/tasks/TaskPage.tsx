import React, { useCallback, useEffect, useState } from 'react';
import { logger } from '@lark-apaas/client-toolkit/logger';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import type {
  Task,
  TaskPriority,
} from '@shared/api.interface';
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from '@client/src/api/tasks';
import { Button } from '@client/src/components/ui/button';
import { Input } from '@client/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@client/src/components/ui/select';
import { Badge } from '@client/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@client/src/components/ui/card';
import { Checkbox } from '@client/src/components/ui/checkbox';

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
];

const FILTER_OPTIONS: { value: 'all' | TaskPriority; label: string }[] = [
  { value: 'all', label: '全部' },
  ...PRIORITY_OPTIONS,
];

const priorityBadgeVariant = (
  priority: TaskPriority,
): 'destructive' | 'secondary' | 'default' => {
  switch (priority) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'default';
  }
};

const priorityLabel = (priority: TaskPriority): string => {
  return PRIORITY_OPTIONS.find((p) => p.value === priority)?.label ?? priority;
};

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | TaskPriority>('all');
  const [title, setTitle] = useState<string>('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTasks(filter === 'all' ? undefined : filter);
      setTasks(
        [...data].sort(
          (a: Task, b: Task) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
    } catch (error) {
      logger.error('加载任务失败', error);
      toast.error(
        (error as { response?: { data?: { error?: { message?: string } } } })
          .response?.data?.error?.message || '加载任务失败',
      );
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  const handleAdd = async () => {
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await createTask({ title: title.trim(), priority });
      setTitle('');
      setPriority('medium');
      await fetchTasks();
    } catch (error) {
      logger.error('添加任务失败', error);
      toast.error(
        (error as { response?: { data?: { error?: { message?: string } } } })
          .response?.data?.error?.message || '添加任务失败',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      await updateTask(id, { completed: !completed });
      await fetchTasks();
    } catch (error) {
      logger.error('更新任务状态失败', error);
      toast.error(
        (error as { response?: { data?: { error?: { message?: string } } } })
          .response?.data?.error?.message || '更新任务状态失败',
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      await fetchTasks();
    } catch (error) {
      logger.error('删除任务失败', error);
      toast.error(
        (error as { response?: { data?: { error?: { message?: string } } } })
          .response?.data?.error?.message || '删除任务失败',
      );
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex justify-center">
      <Card className="w-full max-w-[700px] shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">任务管理</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                placeholder="请输入任务标题"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') void handleAdd();
                }}
              />
            </div>
            <Select
              value={priority}
              onValueChange={(val: string) =>
                setPriority(val as TaskPriority)
              }
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="优先级" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => void handleAdd()} disabled={submitting}>
              添加
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">筛选：</span>
            <Select
              value={filter}
              onValueChange={(val: string) =>
                setFilter(val as 'all' | TaskPriority)
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            {loading ? (
              <div className="text-center text-muted-foreground py-8">
                加载中...
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                暂无任务，快去添加一个吧
              </div>
            ) : (
              tasks.map((task: Task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors"
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggle(task.id, task.completed)}
                    aria-label={
                      task.completed ? '标记为未完成' : '标记为已完成'
                    }
                  />
                  <span
                    className={`flex-1 text-sm ${
                      task.completed
                        ? 'line-through text-muted-foreground'
                        : ''
                    }`}
                  >
                    {task.title}
                  </span>
                  <Badge variant={priorityBadgeVariant(task.priority)}>
                    {priorityLabel(task.priority)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(task.id)}
                    aria-label="删除任务"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskPage;
