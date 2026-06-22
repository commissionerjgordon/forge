'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']),
  boardId: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateTaskModalProps {
  boardId: string;
  onTaskCreated: (newTask: any) => void;
  defaultStatus?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
}

export function CreateTaskModal({
  boardId,
  onTaskCreated,
  defaultStatus,
}: CreateTaskModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'MEDIUM',
      status: defaultStatus,
      boardId: boardId,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error();

      const newTask = await res.json();
      onTaskCreated(newTask);
      toast.success('Task created successfully!');
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={20} />
          New Task
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Add a new task to your board</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="title">Task Title</Label>
            <div className="pt-2">
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Implement user authentication"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <div className="pt-2">
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Add details about the task..."
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Priority</Label>
              <div className="pt-2">
                <Select
                  onValueChange={(value) =>
                    form.setValue('priority', value as any)
                  }
                  defaultValue="MEDIUM"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Status</Label>
              <div className="pt-2">
                <Select
                  onValueChange={(value) =>
                    form.setValue('status', value as any)
                  }
                  defaultValue={defaultStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">To Do</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="REVIEW">Review</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
