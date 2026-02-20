import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegisterUser } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import type { TasksMetadata } from '../backend';

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

    // Validate all required fields
    if (!formData.username.trim()) {
      toast.error('Username is required');
      return;
    }

    if (!formData.whatsappNumber.trim()) {
      toast.error('WhatsApp number is required');
      return;
    }

    if (!formData.groupNumber.trim()) {
      toast.error('Group number is required');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!formData.password.trim()) {
      toast.error('Password is required');
      return;
    }

    // Validate WhatsApp number format
    const whatsappRegex = /^\+?[1-9]\d{1,14}$/;
    if (!whatsappRegex.test(formData.whatsappNumber.replace(/\s/g, ''))) {
      toast.error('Please enter a valid WhatsApp number (e.g., +1234567890)');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    // First, authenticate with Internet Identity
    if (!identity) {
      toast.info('Please authenticate with Internet Identity to continue');
      try {
        await login();
        // After login, the form will still be filled, user can click Register again
        toast.success('Authentication successful! Now click Register again to complete registration.');
        return;
      } catch (error: any) {
        console.error('Authentication error:', error);
        toast.error('Authentication failed. Please try again.');
        return;
      }
    }

    // Now proceed with registration
    try {
      // Generate a unique referral code for this user
      const userReferralCode = `REF${Date.now().toString(36).toUpperCase()}`;

      const profile: TasksMetadata = {
        username: formData.username.trim(),
        whatsappNumber: formData.whatsappNumber.trim(),
        groupNumber: formData.groupNumber.trim(),
        email: formData.email.trim(),
        passwordHash: formData.password,
        referralCode: userReferralCode,
        principal: identity.getPrincipal().toString(),
        isApproved: true,
        referrals: [],
        tasks: [],
        completedTasks: [],
        totalEarnings: BigInt(0),
      };

      await registerMutation.mutateAsync(profile);
      
      // Show success message
      toast.success('Registration Successful! You can now log in');
      
      // Wait 2 seconds before redirecting to allow user to see the success message
      setTimeout(() => {
        navigate({ to: '/login' });
      }, 2000);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.message || 'Registration failed';
      
      if (errorMessage.includes('already registered')) {
        toast.error('This account is already registered. Please login instead.');
      } else if (errorMessage.includes('Username already exists')) {
        toast.error('This username is already taken. Please choose another one.');
      } else if (errorMessage.includes('Email already registered')) {
        toast.error('This email is already registered. Please use another email or login.');
      } else if (errorMessage.includes('WhatsApp number already registered')) {
        toast.error('This WhatsApp number is already registered. Please use another number or login.');
      } else {
        toast.error(`Registration failed: ${errorMessage}`);
      }
    }
  };

  const isAuthenticated = !!identity;
  const isSubmitting = registerMutation.isPending || loginStatus === 'logging-in';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.65_0.25_250)] to-[oklch(0.45_0.20_260)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Join MHS Online Earn Platform today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isAuthenticated && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-md text-sm">
                ✓ Authenticated with Internet Identity
              </div>
            )}

            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter your username"
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
                placeholder="Enter your group number"
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
                placeholder="your.email@example.com"
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
                placeholder="At least 6 characters"
                minLength={6}
              />
            </div>

            <div>
              <Label htmlFor="referral">Referral Code (Optional)</Label>
              <Input
                id="referral"
                value={formData.referralCode}
                onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                placeholder="Enter referral code if you have one"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[oklch(0.55_0.25_250)] hover:bg-[oklch(0.50_0.25_250)]"
              disabled={isSubmitting}
            >
              {loginStatus === 'logging-in'
                ? 'Authenticating...'
                : registerMutation.isPending
                ? 'Creating Account...'
                : isAuthenticated
                ? 'Complete Registration'
                : 'Authenticate & Register'}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate({ to: '/login' })}
                className="text-[oklch(0.55_0.25_250)] hover:underline font-medium"
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
