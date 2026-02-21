import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthenticate } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { registered?: string };
  const authenticateMutation = useAuthenticate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // Check if redirected from registration and show success message
  useEffect(() => {
    if (search.registered === 'true') {
      toast.success('Registration Successful! You can now log in');
      
      // Clear the search parameter to prevent showing the message again
      navigate({ 
        to: '/login',
        search: {},
        replace: true
      });
    }
  }, [search.registered, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    if (!formData.username.trim()) {
      toast.error('Username is required');
      return;
    }

    if (!formData.password.trim()) {
      toast.error('Password is required');
      return;
    }

    try {
      const response = await authenticateMutation.mutateAsync({
        username: formData.username.trim(),
        password: formData.password,
      });

      if (response.success) {
        toast.success('Login successful!');
        navigate({ to: '/dashboard' });
      } else {
        toast.error(response.errorMessage || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
    }
  };

  const isSubmitting = authenticateMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.65_0.25_250)] to-[oklch(0.45_0.20_260)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">
            Login to MHS Online Earn Platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              required
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="h-12 px-4 border-gray-300 focus:border-[#0066FF] focus:ring-[#0066FF] rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              className="h-12 px-4 border-gray-300 focus:border-[#0066FF] focus:ring-[#0066FF] rounded-lg"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>

          <div className="pt-4 space-y-3">
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate({ to: '/register' })}
                className="text-[#0066FF] hover:text-[#0052CC] font-semibold hover:underline transition-colors"
              >
                Register here
              </button>
            </div>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => navigate({ to: '/' })}
                className="text-gray-500 hover:text-gray-700 hover:underline transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
