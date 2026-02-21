import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetDailyTasks, useGetBalance } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import TaskList from '../components/TaskList';
import ReferralSection from '../components/ReferralSection';
import { LogOut, Loader2, HelpCircle, PlayCircle, Wallet, ExternalLink } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { identity, clear } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: tasks, isLoading: tasksLoading } = useGetDailyTasks(identity?.getPrincipal());
  const { data: balance, isLoading: balanceLoading } = useGetBalance();

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

  const displayBalance = balanceLoading ? '...' : `${Number(balance || BigInt(0))} TK`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl py-8 px-4">
        {/* Hero Section with New Title and Slogan */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-[oklch(0.55_0.25_250)]">
                WELCOME TO THE BEST MHS★Online Earn Platform - Always Active
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-2">
                আপনার স্বপ্ন পূরণের বিশ্বস্ত সঙ্গী — পরিশ্রম আপনার, পেমেন্টের দায়িত্ব আমাদের!
              </p>
              <p className="text-sm text-muted-foreground">
                Welcome, {userProfile.username}!
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="ml-4"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button
              onClick={() => navigate({ to: '/job-task' })}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3"
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Start from now
            </Button>
            <Button
              onClick={() => navigate({ to: '/support' })}
              className="bg-[oklch(0.55_0.25_250)] hover:bg-[oklch(0.50_0.25_250)] text-white font-semibold px-6 py-3"
            >
              <HelpCircle className="mr-2 h-5 w-5" />
              Help & Support
            </Button>
          </div>

          {/* Platform Statistics */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-1">Total Users</span>
                <span className="text-3xl md:text-4xl font-bold text-[oklch(0.35_0.20_250)]">
                  70,137
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-1">Completed Withdraw</span>
                <span className="text-3xl md:text-4xl font-bold text-[oklch(0.35_0.20_250)]">
                  ৳72,082,200
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Card - Prominent Display */}
        <Card className="mb-8 bg-gradient-to-br from-[oklch(0.55_0.25_250)] to-[oklch(0.45_0.20_250)] text-white border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2 text-white/90">
              <Wallet className="h-5 w-5" />
              Your Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">
              {displayBalance}
            </div>
            <p className="text-sm text-white/80 mt-2">
              Available for withdrawal
            </p>
          </CardContent>
        </Card>

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

        {/* Work Links Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <ExternalLink className="h-6 w-6" />
              Work Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-lg mb-2">External task links will be displayed here</p>
              <p className="text-sm">Check back soon for new opportunities!</p>
            </div>
          </CardContent>
        </Card>

        {/* Referral Section */}
        <ReferralSection referralCode={userProfile.referralCode} />
      </div>
    </div>
  );
}
