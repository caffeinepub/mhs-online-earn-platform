import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, DollarSign } from 'lucide-react';

export default function PaymentProof() {
  const proofs = [
    { id: 1, user: 'User***123', amount: 150, date: '2026-02-18', status: 'Paid' },
    { id: 2, user: 'User***456', amount: 200, date: '2026-02-17', status: 'Paid' },
    { id: 3, user: 'User***789', amount: 100, date: '2026-02-16', status: 'Paid' },
    { id: 4, user: 'User***234', amount: 175, date: '2026-02-15', status: 'Paid' },
    { id: 5, user: 'User***567', amount: 250, date: '2026-02-14', status: 'Paid' },
    { id: 6, user: 'User***890', amount: 125, date: '2026-02-13', status: 'Paid' },
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-center">Payment Proof</CardTitle>
            <CardDescription className="text-center">
              Recent successful withdrawals from our platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proofs.map((proof) => (
                <div
                  key={proof.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-[oklch(0.55_0.25_250)]/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-[oklch(0.55_0.25_250)]" />
                    </div>
                    <div>
                      <div className="font-semibold">{proof.user}</div>
                      <div className="text-sm text-muted-foreground">{proof.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[oklch(0.55_0.25_250)]">
                      ${proof.amount}
                    </div>
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                      {proof.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
