import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetDailyTasks } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import TaskList from '../components/TaskList';
import ReferralSection from '../components/ReferralSection';
import { LogOut, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { identity, clear } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: tasks, isLoading: tasksLoading } = useGetDailyTasks(identity?.getPrincipal());

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/login' });
      return;
    }

    if (isFetched && !userProfile) {
      navigate({ to: '/register' });
      return;
    }

    if (isFetched && userProfile && !userProfile.isApproved) {
      navigate({ to: '/login' });
    }
  }, [identity, userProfile, isFetched, navigate]);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  if (profileLoading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[oklch(0.55_0.25_250)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl py-8 px-4">
        {/* Welcome Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {userProfile.username}!</h1>
            <p className="text-muted-foreground">Track your earnings and complete daily tasks</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[oklch(0.55_0.25_250)]">
                ${Number(userProfile.totalEarnings)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[oklch(0.55_0.25_250)]">
                {userProfile.completedTasks.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[oklch(0.55_0.25_250)]">
                {userProfile.referrals.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Tasks Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">10+ Daily Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[oklch(0.55_0.25_250)]" />
              </div>
            ) : (
              <TaskList tasks={tasks || []} completedTaskIds={userProfile.completedTasks.map(t => t.taskId)} />
            )}
          </CardContent>
        </Card>

        {/* Referral Section */}
        <ReferralSection referralCode={userProfile.referralCode} />
      </div>
    </div>
  );
}
