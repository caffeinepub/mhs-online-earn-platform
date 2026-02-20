import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import JobCard from '../components/JobCard';

export default function JobTask() {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl text-center">10+ Daily Tasks</CardTitle>
            <p className="text-center text-muted-foreground mt-2">
              Complete each task to earn rewards. Click "Start Task" to begin the 10-second timer.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 10 }, (_, i) => (
                <JobCard key={i + 1} jobNumber={i + 1} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
