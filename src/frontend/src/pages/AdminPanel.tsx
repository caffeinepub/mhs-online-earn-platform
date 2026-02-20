import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetAllUsers, useGetAllTasks } from '../hooks/useQueries';
import UserManagementTable from '../components/UserManagementTable';
import TaskManagementPanel from '../components/TaskManagementPanel';
import { LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { data: users, isLoading: usersLoading, refetch: refetchUsers } = useGetAllUsers();
  const { data: tasks, isLoading: tasksLoading, refetch: refetchTasks } = useGetAllTasks();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    setIsAuthenticated(isAdminLoggedIn);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple local authentication
    if (username === 'admin' && password === 'habibur123') {
      localStorage.setItem('adminLoggedIn', 'true');
      setIsAuthenticated(true);
      toast.success('Admin login successful!');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    toast.success('Logged out successfully');
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[oklch(0.65_0.25_250)] to-[oklch(0.45_0.20_260)] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[oklch(0.55_0.25_250)] hover:bg-[oklch(0.50_0.25_250)]"
              >
                Login
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <button
                  type="button"
                  onClick={() => navigate({ to: '/' })}
                  className="hover:underline"
                >
                  ← Back to Home
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show admin dashboard if authenticated
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl py-8 px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">MHS Online Earn Platform</p>
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
