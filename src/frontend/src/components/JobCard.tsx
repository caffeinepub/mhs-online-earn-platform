import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle } from 'lucide-react';

interface JobCardProps {
  jobNumber: number;
}

export default function JobCard({ jobNumber }: JobCardProps) {
  const [status, setStatus] = useState<'idle' | 'running' | 'complete'>('idle');
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (status === 'running' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === 'running' && timeLeft === 0) {
      setStatus('complete');
    }
  }, [status, timeLeft]);

  const handleStart = () => {
    setStatus('running');
    setTimeLeft(10);
  };

  const handleReset = () => {
    setStatus('idle');
    setTimeLeft(10);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">Job {jobNumber}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'idle' && (
          <Button
            onClick={handleStart}
            className="w-full bg-[oklch(0.55_0.25_250)] hover:bg-[oklch(0.50_0.25_250)]"
          >
            Start Task
          </Button>
        )}

        {status === 'running' && (
          <div className="text-center space-y-3">
            <Clock className="h-12 w-12 mx-auto text-[oklch(0.55_0.25_250)] animate-pulse" />
            <div className="text-2xl font-bold text-[oklch(0.55_0.25_250)]">
              {timeLeft}s
            </div>
            <p className="text-sm text-muted-foreground">Time remaining...</p>
          </div>
        )}

        {status === 'complete' && (
          <div className="text-center space-y-3">
            <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
            <div className="text-xl font-bold text-green-600">
              Task Complete!
            </div>
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full"
            >
              Reset
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
