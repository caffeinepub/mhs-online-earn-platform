import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Zap, TrendingUp, Shield } from 'lucide-react';
import { SiFacebook } from 'react-icons/si';
import { useGetAllUsers } from '../hooks/useQueries';

export default function Home() {
  const navigate = useNavigate();
  const { data: allUsers } = useGetAllUsers();
  const totalUsers = allUsers?.length || 0;

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section 
        className="relative text-white py-20 px-4"
        style={{
          backgroundImage: 'url(/assets/1770720033234-1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" style={{ zIndex: 0 }} />
        
        {/* Content */}
        <div className="container mx-auto max-w-6xl relative" style={{ zIndex: 1 }}>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              MHS★Online Earn Platform
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Start earning today with simple daily tasks
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-white" />
              <div className="text-3xl font-bold mb-1">{totalUsers}</div>
              <div className="text-white/80">Total Users</div>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center">
              <Zap className="w-12 h-12 mx-auto mb-3 text-white" />
              <div className="text-3xl font-bold mb-1">Always Active</div>
              <div className="text-white/80">24/7 Support</div>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate({ to: '/register' })}
              className="bg-white text-[oklch(0.55_0.25_250)] hover:bg-white/90 font-semibold text-lg px-8 py-6"
            >
              Start from now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.open('https://www.facebook.com/md.habibur.rahman.62356', '_blank', 'noopener,noreferrer')}
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6"
            >
              <SiFacebook className="mr-2 h-5 w-5" />
              Help & Support
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-[oklch(0.55_0.25_250)]" />
              <h3 className="text-xl font-semibold mb-2">Daily Tasks</h3>
              <p className="text-muted-foreground">
                Complete 10+ daily tasks and earn rewards instantly
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 mx-auto mb-4 text-[oklch(0.55_0.25_250)]" />
              <h3 className="text-xl font-semibold mb-2">Referral System</h3>
              <p className="text-muted-foreground">
                Earn extra by inviting friends with your unique referral link
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Shield className="w-12 h-12 mx-auto mb-4 text-[oklch(0.55_0.25_250)]" />
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-muted-foreground">
                Your data is safe with our blockchain-based security
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center text-muted-foreground">
          <p>
            © {new Date().getFullYear()} MHS★Online Earn Platform. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
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
