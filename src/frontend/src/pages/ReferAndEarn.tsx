import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import ReferralSection from '../components/ReferralSection';
import { Users, DollarSign, Gift, Loader2 } from 'lucide-react';

export default function ReferAndEarn() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/login' });
      return;
    }

    if (isFetched && !userProfile) {
      navigate({ to: '/register' });
    }
  }, [identity, userProfile, isFetched, navigate]);

  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[oklch(0.55_0.25_250)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Gift className="h-12 w-12 text-[oklch(0.55_0.25_250)]" />
            </div>
            <CardTitle className="text-3xl text-center">Refer & Earn</CardTitle>
            <CardDescription className="text-center">
              Invite your friends and earn extra rewards for each successful referral
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-muted rounded-lg">
                <Users className="h-8 w-8 mx-auto mb-3 text-[oklch(0.55_0.25_250)]" />
                <h3 className="font-semibold mb-2">Share Your Link</h3>
                <p className="text-sm text-muted-foreground">
                  Share your unique referral link with friends
                </p>
              </div>
              <div className="text-center p-6 bg-muted rounded-lg">
                <Gift className="h-8 w-8 mx-auto mb-3 text-[oklch(0.55_0.25_250)]" />
                <h3 className="font-semibold mb-2">They Sign Up</h3>
                <p className="text-sm text-muted-foreground">
                  Your friends register using your link
                </p>
              </div>
              <div className="text-center p-6 bg-muted rounded-lg">
                <DollarSign className="h-8 w-8 mx-auto mb-3 text-[oklch(0.55_0.25_250)]" />
                <h3 className="font-semibold mb-2">Earn Rewards</h3>
                <p className="text-sm text-muted-foreground">
                  Get bonus earnings for each referral
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <ReferralSection referralCode={userProfile.referralCode} />
      </div>
    </div>
  );
}
