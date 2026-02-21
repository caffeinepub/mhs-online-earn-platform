import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegisterUser } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { TasksMetadata } from '../backend';
import { Principal } from '@dfinity/principal';

export default function Register() {
  const navigate = useNavigate();
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

    // Relaxed WhatsApp number validation: must be exactly 11 digits starting with '01'
    const whatsappNumber = formData.whatsappNumber.trim();
    if (whatsappNumber.length !== 11) {
      toast.error('WhatsApp number must be exactly 11 digits');
      return;
    }
    
    if (!whatsappNumber.startsWith('01')) {
      toast.error('WhatsApp number must start with 01');
      return;
    }

    // Check if all characters after '01' are digits
    const remainingDigits = whatsappNumber.slice(2);
    if (!/^\d+$/.test(remainingDigits)) {
      toast.error('WhatsApp number must contain only digits');
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

    try {
      // Generate a unique referral code for this user
      const userReferralCode = `REF${Date.now().toString(36).toUpperCase()}`;

      // Create anonymous principal for registration
      const anonymousPrincipal = Principal.anonymous();

      const profile: TasksMetadata = {
        username: formData.username.trim(),
        whatsappNumber: whatsappNumber,
        groupNumber: formData.groupNumber.trim(),
        email: formData.email.trim(),
        passwordHash: formData.password,
        referralCode: userReferralCode,
        principal: anonymousPrincipal.toString(),
        isApproved: true,
        referrals: [],
        tasks: [],
        completedTasks: [],
        totalEarnings: BigInt(0),
      };

      await registerMutation.mutateAsync(profile);
      
      toast.success('Registration successful! Please login with your credentials.');
      
      // Redirect to login page with success parameter
      navigate({ 
        to: '/login',
        search: { registered: 'true' }
      });
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Extract the error message from the error object
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Handle specific error cases with user-friendly messages
      if (errorMessage.includes('Username already exists')) {
        toast.error('This username is already taken. Please choose a different username.');
      } else if (errorMessage.includes('Email already registered')) {
        toast.error('This email is already registered. Please use a different email or login.');
      } else if (errorMessage.includes('already registered')) {
        toast.error('An account with these details already exists. Please login or use different details.');
      } else {
        // Show the actual error message for debugging
        toast.error(errorMessage);
      }
    }
  };

  const isSubmitting = registerMutation.isPending;

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
                placeholder="01XXXXXXXXX"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                maxLength={11}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter 11 digits starting with 01
              </p>
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
              {isSubmitting ? 'Creating Account...' : 'Register'}
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
