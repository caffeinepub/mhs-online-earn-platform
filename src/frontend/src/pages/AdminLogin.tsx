import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check if already logged in as admin
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (isAdminLoggedIn) {
      navigate({ to: '/admin-panel' });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple local authentication
    if (username === 'admin' && password === 'habibur123') {
      localStorage.setItem('adminLoggedIn', 'true');
      toast.success('Admin login successful!');
      navigate({ to: '/admin-panel' });
    } else {
      toast.error('Invalid credentials');
    }
  };

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
