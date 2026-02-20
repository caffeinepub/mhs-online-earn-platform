import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Users, DollarSign, TrendingUp } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div
        className="relative min-h-[600px] flex items-center justify-center"
        style={{
          backgroundImage: 'url(/assets/1770720033234.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            MHS Online Earn Platform
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md">
            Start earning money online by completing simple tasks. Join thousands of users already making money!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate({ to: '/register' })}
              className="bg-[oklch(0.55_0.25_250)] hover:bg-[oklch(0.50_0.25_250)] text-white text-lg px-8 py-6"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate({ to: '/login' })}
              className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 text-lg px-8 py-6"
            >
              Login
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 mx-auto mb-4 text-[oklch(0.55_0.25_250)]" />
                <CardTitle className="text-3xl font-bold">5,000+</CardTitle>
                <CardDescription>Active Users</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-[oklch(0.55_0.25_250)]" />
                <CardTitle className="text-3xl font-bold">$50,000+</CardTitle>
                <CardDescription>Total Earnings Paid</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-[oklch(0.55_0.25_250)]" />
                <CardTitle className="text-3xl font-bold">10,000+</CardTitle>
                <CardDescription>Tasks Completed</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Easy Tasks</CardTitle>
                <CardDescription>
                  Complete simple tasks like watching videos, clicking ads, and more
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fast Payments</CardTitle>
                <CardDescription>
                  Get paid quickly through multiple payment methods including bKash, Nagad, and Rocket
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Referral Bonus</CardTitle>
                <CardDescription>
                  Earn extra income by referring friends and family to the platform
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>24/7 Support</CardTitle>
                <CardDescription>
                  Our support team is always available to help you with any questions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Secure Platform</CardTitle>
                <CardDescription>
                  Your data and earnings are protected with advanced security measures
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>No Investment</CardTitle>
                <CardDescription>
                  Start earning without any upfront investment or hidden fees
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-[oklch(0.55_0.25_250)] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Earning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community today and start making money from the comfort of your home
          </p>
          <Button
            size="lg"
            onClick={() => navigate({ to: '/register' })}
            className="bg-white text-[oklch(0.55_0.25_250)] hover:bg-gray-100 text-lg px-8 py-6"
          >
            Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-background border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>
            © {new Date().getFullYear()} MHS Online Earn Platform. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'mhs-online-earn-platform'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[oklch(0.55_0.25_250)] hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
