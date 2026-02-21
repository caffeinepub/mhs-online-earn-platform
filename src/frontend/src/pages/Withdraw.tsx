import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSubmitWithdrawRequest, useGetUserWithdrawHistory } from '@/hooks/useQueries';
import { toast } from 'sonner';

export default function Withdraw() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amount, setAmount] = useState('');

  const submitWithdrawMutation = useSubmitWithdrawRequest();
  const { data: withdrawHistory = [], isLoading: historyLoading } = useGetUserWithdrawHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!phoneNumber || !paymentMethod || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!/^01\d{9}$/.test(phoneNumber)) {
      toast.error('Please enter a valid 11-digit phone number starting with 01');
      return;
    }

    try {
      await submitWithdrawMutation.mutateAsync({
        phoneNumber,
        amount: BigInt(amount),
        paymentMethod,
      });

      toast.success('Withdrawal request submitted successfully!');
      
      // Reset form
      setPhoneNumber('');
      setPaymentMethod('');
      setAmount('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit withdrawal request');
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-foreground">
          Let's Withdraw Your Balance
        </h1>

        {/* Orange Banner */}
        <div className="bg-orange-500 text-white rounded-lg p-4 mb-6 text-center font-medium">
          🎥ইনকামের টাকা হাতের মুঠোয়! 💵 ভিডিওতে বিস্তারিত দেখুন 📹
        </div>

        {/* Payout Instructions */}
        <div className="bg-muted rounded-lg p-6 mb-6 space-y-2 text-center">
          <p className="text-foreground">
            💫 সকাল ৯টা ⏰ থেকে রাত ১২টা 🌙 পর্যন্ত যেকোনো সময় উইথড্র দিন ✅
          </p>
          <p className="text-foreground">
            ⚡ মাত্র কয়েক ঘণ্টার মধ্যেই পেমেন্ট হাতে পাবেন 💸
          </p>
          <p className="text-foreground font-semibold">
            💰 দ্রুত, সহজ ও নিশ্চিন্ত পেমেন্ট সিস্টেম 🚀
          </p>
        </div>

        {/* Withdrawal Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Withdraw Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="phoneNumber">Your withdraw number</Label>
                <Input
                  id="phoneNumber"
                  type="text"
                  placeholder="01..."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  maxLength={11}
                />
              </div>

              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bkash">Bkash 💸</SelectItem>
                    <SelectItem value="Nagad">Nagad 💸</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <Select value={amount} onValueChange={setAmount}>
                  <SelectTrigger id="amount">
                    <SelectValue placeholder="Select amount" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50 TK</SelectItem>
                    <SelectItem value="100">100 TK</SelectItem>
                    <SelectItem value="200">200 TK</SelectItem>
                    <SelectItem value="500">500 TK</SelectItem>
                    <SelectItem value="1000">1000 TK</SelectItem>
                    <SelectItem value="2000">2000 TK</SelectItem>
                    <SelectItem value="3000">3000 TK</SelectItem>
                    <SelectItem value="4000">4000 TK</SelectItem>
                    <SelectItem value="5000">5000 TK</SelectItem>
                    <SelectItem value="10000">10000 TK</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
                disabled={submitWithdrawMutation.isPending}
              >
                {submitWithdrawMutation.isPending ? 'Submitting...' : 'Request Withdraw'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Your Transition history</CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <p className="text-center text-muted-foreground py-4">Loading history...</p>
            ) : withdrawHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No withdrawal history yet</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">#</TableHead>
                      <TableHead>Submit Time</TableHead>
                      <TableHead>Number</TableHead>
                      <TableHead>Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawHistory.map((request, index) => (
                      <TableRow key={request.id.toString()}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{formatTimestamp(request.submitTime)}</TableCell>
                        <TableCell>{request.phoneNumber}</TableCell>
                        <TableCell>{request.paymentMethod}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Section */}
        <div className="text-center bg-muted rounded-lg p-6">
          <p className="text-lg font-medium text-foreground mb-2">Need Help?</p>
          <a
            href="https://wa.me/8801704186771"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 font-semibold text-lg inline-flex items-center gap-2"
          >
            WhatsApp: 01704186771
          </a>
        </div>
      </div>
    </div>
  );
}
