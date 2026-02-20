import { SiFacebook } from 'react-icons/si';
import { Button } from '@/components/ui/button';

export default function FloatingFacebookButton() {
  const handleClick = () => {
    window.open('https://www.facebook.com/md.habibur.rahman.62356', '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-[oklch(0.55_0.25_250)] hover:bg-[oklch(0.50_0.25_250)] z-50"
      size="icon"
      aria-label="Contact us on Facebook"
    >
      <SiFacebook className="h-6 w-6" />
    </Button>
  );
}
