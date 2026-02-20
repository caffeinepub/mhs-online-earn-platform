import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Job Task', path: '/job-task' },
    { label: 'Withdraw', path: '/withdraw' },
    { label: 'Refer & Earn', path: '/refer-earn' },
    { label: 'Payment Proof', path: '/payment-proof' },
    { label: 'Support', path: '/support' },
  ];

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-[oklch(0.55_0.25_250)] text-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold hover:opacity-90 transition-opacity">
            MHS★Online Earn
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => handleNavigation(item.path)}
                className="text-white hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="block w-full text-left px-4 py-2 hover:bg-white/10 rounded-md transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
