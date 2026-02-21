import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAddBalance } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2, DollarSign } from 'lucide-react';

export default function MhsAdminPanel() {
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const addBalanceMutation = useAddBalance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid positive amount');
      return;
    }

    try {
      await addBalanceMutation.mutateAsync({
        username: username.trim(),
        amount: BigInt(Math.floor(amountNum)),
      });

      toast.success(`Successfully added ${amountNum} TK to ${username}'s balance`);
      
      // Reset form
      setUsername('');
      setAmount('');
    } catch (error: any) {
      console.error('Error adding balance:', error);
      if (error.message?.includes('User not found')) {
        toast.error('User not found. Please check the username.');
      } else if (error.message?.includes('Unauthorized')) {
        toast.error('Unauthorized. Admin access required.');
      } else {
        toast.error('Failed to add balance. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[oklch(0.55_0.25_250)] to-[oklch(0.45_0.20_250)] text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              MHS Admin Panel
            </CardTitle>
            <CardDescription className="text-white/90">
              Manually add balance to user accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-base font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={addBalanceMutation.isPending}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-base font-medium">
                  Amount (TK)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={addBalanceMutation.isPending}
                  min="1"
                  step="1"
                  className="h-11"
                />
              </div>

              <Button
                type="submit"
                disabled={addBalanceMutation.isPending}
                className="w-full h-12 text-base font-semibold bg-[oklch(0.55_0.25_250)] hover:bg-[oklch(0.50_0.25_250)]"
              >
                {addBalanceMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Adding Balance...
                  </>
                ) : (
                  'Add Balance'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
