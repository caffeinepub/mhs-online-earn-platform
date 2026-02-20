import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetReferralCount, useGetReferralEarnings } from '../hooks/useQueries';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ReferralSectionProps {
  referralCode: string;
}

export default function ReferralSection({ referralCode }: ReferralSectionProps) {
  const { data: referralCount } = useGetReferralCount();
  const { data: referralEarnings } = useGetReferralEarnings();
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Referral System</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Total Referrals</div>
            <div className="text-3xl font-bold text-[oklch(0.55_0.25_250)]">
              {Number(referralCount || 0)}
            </div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Referral Earnings</div>
            <div className="text-3xl font-bold text-[oklch(0.55_0.25_250)]">
              ${Number(referralEarnings || 0)}
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Your Referral Link</label>
          <div className="flex gap-2">
            <Input value={referralLink} readOnly className="flex-1" />
            <Button
              onClick={handleCopy}
              className="bg-[oklch(0.55_0.25_250)] hover:bg-[oklch(0.50_0.25_250)]"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Share this link with friends to earn extra rewards!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
