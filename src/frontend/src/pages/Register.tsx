import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegisterUser } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import type { UserProfile } from '../backend';

export default function Register() {
  const navigate = useNavigate();
  const { login, identity, loginStatus } = useInternetIdentity();
  const registerMutation = useRegisterUser();

  const [formData, setFormData] = useState({
    username: '',
    whatsappNumber: '',
    groupNumber: '',
    email: '',
    password: '',
    referralCode: '',
  });

  // Parse referral code from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setFormData((prev) => ({ ...prev, referralCode: refCode }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate WhatsApp number format
    const whatsappRegex = /^\+?[1-9]\d{1,14}$/;
    if (!whatsappRegex.test(formData.whatsappNumber.replace(/\s/g, ''))) {
      toast.error('Please enter a valid WhatsApp number');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // First, authenticate with Internet Identity
    if (!identity) {
      toast.info('Please authenticate to continue registration');
      login();
      return;
    }

    try {
      // Generate a unique referral code for this user
      const userReferralCode = `REF${Date.now().toString(36).toUpperCase()}`;

      const profile: UserProfile = {
        username: formData.username,
        whatsappNumber: formData.whatsappNumber,
        groupNumber: formData.groupNumber,
        email: formData.email,
        passwordHash: formData.password, // Backend will handle hashing
        referralCode: userReferralCode,
        isApproved: false,
        referrals: [],
        tasks: [],
        completedTasks: [],
        totalEarnings: BigInt(0),
      };

      await registerMutation.mutateAsync(profile);
      toast.success('Registration successful! Please wait for admin approval.');
      navigate({ to: '/login' });
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.65_0.25_250)] to-[oklch(0.45_0.20_260)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Join MHS★Online Earn Platform today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp Number *</Label>
              <Input
                id="whatsapp"
                type="tel"
                required
                placeholder="+1234567890"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="group">Group Number *</Label>
              <Input
                id="group"
                required
                value={formData.groupNumber}
                onChange={(e) => setFormData({ ...formData, groupNumber: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="referral">Referral Code (Optional)</Label>
              <Input
                id="referral"
                value={formData.referralCode}
                onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[oklch(0.55_0.25_250)] hover:bg-[oklch(0.50_0.25_250)]"
              disabled={registerMutation.isPending || loginStatus === 'logging-in'}
            >
              {loginStatus === 'logging-in'
                ? 'Authenticating...'
                : registerMutation.isPending
                ? 'Registering...'
                : 'Register'}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate({ to: '/login' })}
                className="text-[oklch(0.55_0.25_250)] hover:underline"
              >
                Login here
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
