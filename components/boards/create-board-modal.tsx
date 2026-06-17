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
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(3, 'Board name must be at least 3 characters'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateBoardModalProps {
  projectId: string;
  onBoardCreated?: (board: any) => void;
}

export function CreateBoardModal({
  projectId,
  onBoardCreated,
}: CreateBoardModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', description: '' },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          projectId,
        }),
      });

      if (!res.ok) throw new Error();

      const newBoard = await res.json();
      toast.success('Board created successfully!');
      form.reset();
      setOpen(false);
      onBoardCreated?.(newBoard);
    } catch (error) {
      toast.error('Failed to create board');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus size={18} />
          New Board
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
          <DialogDescription>
            Create a new Kanban board inside this project
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Board Name</Label>
            <div className="pt-2">
              <Input {...form.register('name')} placeholder="Sprint Planning" />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <div className="pt-2">
              <Textarea
                {...form.register('description')}
                placeholder="Optional description..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Board</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
