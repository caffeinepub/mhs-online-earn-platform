import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetAllUsers, useGetAllTasks } from '../hooks/useQueries';
import UserManagementTable from '../components/UserManagementTable';
import TaskManagementPanel from '../components/TaskManagementPanel';
import { LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { data: users, isLoading: usersLoading, refetch: refetchUsers } = useGetAllUsers();
  const { data: tasks, isLoading: tasksLoading, refetch: refetchTasks } = useGetAllTasks();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isAdminLoggedIn) {
      navigate({ to: '/admin-login' });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    toast.success('Logged out successfully');
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl py-8 px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">MHS★Online Earn Platform</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="tasks">Task Management</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-[oklch(0.55_0.25_250)]" />
                  </div>
                ) : (
                  <UserManagementTable users={users || []} onRefresh={refetchUsers} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-[oklch(0.55_0.25_250)]" />
                  </div>
                ) : (
                  <TaskManagementPanel tasks={tasks || []} onRefresh={refetchTasks} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
