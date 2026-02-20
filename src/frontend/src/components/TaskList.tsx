import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCompleteTask } from '../hooks/useQueries';
import { toast } from 'sonner';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import type { Task } from '../backend';

interface TaskListProps {
  tasks: Task[];
  completedTaskIds: bigint[];
}

export default function TaskList({ tasks, completedTaskIds }: TaskListProps) {
  const completeTaskMutation = useCompleteTask();

  const isTaskCompleted = (taskId: bigint) => {
    return completedTaskIds.some(id => id === taskId);
  };

  const handleCompleteTask = async (taskId: bigint) => {
    try {
      await completeTaskMutation.mutateAsync(taskId);
      toast.success('Task completed successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete task');
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tasks available at the moment. Check back later!
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task, index) => {
        const completed = isTaskCompleted(task.id);
        return (
          <Card key={task.id.toString()} className={completed ? 'bg-muted/50' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <CardTitle className="text-lg">
                    Job {index + 1}: {task.title}
                  </CardTitle>
                </div>
                <Badge variant={completed ? 'secondary' : 'default'}>
                  ${Number(task.reward)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
              {!completed && (
                <Button
                  onClick={() => handleCompleteTask(task.id)}
                  disabled={completeTaskMutation.isPending}
                  className="bg-[oklch(0.55_0.25_250)] hover:bg-[oklch(0.50_0.25_250)]"
                >
                  {completeTaskMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    'Complete Task'
                  )}
                </Button>
              )}
              {completed && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Completed
                </Badge>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
