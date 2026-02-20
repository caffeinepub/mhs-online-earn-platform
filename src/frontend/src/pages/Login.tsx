import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, identity, loginStatus, clear } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  useEffect(() => {
    if (identity && isFetched && userProfile) {
      if (userProfile.isApproved) {
        navigate({ to: '/dashboard' });
      } else {
        toast.error('Your account is pending approval. Please wait for admin approval.');
      }
    }
  }, [identity, userProfile, isFetched, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      } else {
        toast.error('Login failed. Please try again.');
      }
    }
  };

  const isLoading = loginStatus === 'logging-in' || profileLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.65_0.25_250)] to-[oklch(0.45_0.20_260)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Login to MHS★Online Earn Platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-[oklch(0.55_0.25_250)] hover:bg-[oklch(0.50_0.25_250)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login with Internet Identity'
            )}
          </Button>

          <div className="text-center text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate({ to: '/register' })}
              className="text-[oklch(0.55_0.25_250)] hover:underline"
            >
              Register here
            </button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <button
              type="button"
              onClick={() => navigate({ to: '/' })}
              className="hover:underline"
            >
              ← Back to Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
