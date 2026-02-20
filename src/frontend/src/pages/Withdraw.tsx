import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Withdraw() {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <DollarSign className="h-12 w-12 text-[oklch(0.55_0.25_250)]" />
            </div>
            <CardTitle className="text-3xl text-center">Withdraw Earnings</CardTitle>
            <CardDescription className="text-center">
              Request a withdrawal of your earned rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Minimum withdrawal amount is $10. Processing time: 1-3 business days.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Withdrawal Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  min="10"
                />
              </div>

              <div>
                <Label htmlFor="method">Payment Method</Label>
                <select
                  id="method"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select payment method</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="crypto">Cryptocurrency</option>
                </select>
              </div>

              <div>
                <Label htmlFor="account">Account Details</Label>
                <Input
                  id="account"
                  placeholder="Enter your account details"
                />
              </div>

              <Button
                className="w-full bg-[oklch(0.55_0.25_250)] hover:bg-[oklch(0.50_0.25_250)]"
                size="lg"
              >
                Request Withdrawal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
