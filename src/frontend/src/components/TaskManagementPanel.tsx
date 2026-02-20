import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAddTask, useDeleteTask } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2, Trash2, Plus } from 'lucide-react';
import { TaskStatus, type Task } from '../backend';

interface TaskManagementPanelProps {
  tasks: Task[];
  onRefresh: () => void;
}

export default function TaskManagementPanel({ tasks, onRefresh }: TaskManagementPanelProps) {
  const addTaskMutation = useAddTask();
  const deleteTaskMutation = useDeleteTask();

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    reward: '',
  });

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTask.title || !newTask.description || !newTask.reward) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const task: Task = {
        id: BigInt(Date.now()),
        title: newTask.title,
        description: newTask.description,
        reward: BigInt(newTask.reward),
        status: TaskStatus.open,
      };

      await addTaskMutation.mutateAsync(task);
      toast.success('Task added successfully!');
      setNewTask({ title: '', description: '', reward: '' });
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add task');
    }
  };

  const handleDeleteTask = async (taskId: bigint) => {
    try {
      await deleteTaskMutation.mutateAsync(taskId);
      toast.success('Task deleted successfully!');
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete task');
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Task Form */}
      <div className="border rounded-lg p-4 bg-muted/50">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Task
        </h3>
        <form onSubmit={handleAddTask} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="e.g., Complete Survey"
              />
            </div>
            <div>
              <Label htmlFor="reward">Reward ($)</Label>
              <Input
                id="reward"
                type="number"
                value={newTask.reward}
                onChange={(e) => setNewTask({ ...newTask, reward: e.target.value })}
                placeholder="e.g., 10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Describe the task..."
              rows={3}
            />
          </div>
          <Button
            type="submit"
            disabled={addTaskMutation.isPending}
            className="bg-[oklch(0.55_0.25_250)] hover:bg-[oklch(0.50_0.25_250)]"
          >
            {addTaskMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Task'
            )}
          </Button>
        </form>
      </div>

      {/* Existing Tasks Table */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Existing Tasks</h3>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No tasks created yet. Add your first task above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id.toString()}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{task.description}</TableCell>
                    <TableCell>${Number(task.reward)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteTask(task.id)}
                        disabled={deleteTaskMutation.isPending}
                      >
                        {deleteTaskMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
