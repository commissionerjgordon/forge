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
  name: z.string().min(3),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateWorkspaceModalProps {
  onWorkspaceCreated?: () => void;
}

export function CreateWorkspaceModal({
  onWorkspaceCreated,
}: CreateWorkspaceModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', description: '' },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error();

      toast.success('Workspace created successfully!');
      form.reset();
      setOpen(false);
      onWorkspaceCreated?.();
    } catch (error) {
      toast.error('Failed to create workspace');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={20} />
          New Workspace
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
          <DialogDescription>
            Workspaces are where your projects and team live.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label className="pb-2">Workspace Name</Label>
            <Input {...form.register('name')} placeholder="Engineering Team" />
          </div>
          <div>
            <Label className="pb-2">Description</Label>
            <Textarea
              {...form.register('description')}
              placeholder="Main workspace for all engineering projects..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Workspace</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
