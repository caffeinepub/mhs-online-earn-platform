import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SiFacebook } from 'react-icons/si';
import { MessageCircle, Clock, HelpCircle } from 'lucide-react';

export default function Support() {
  const handleFacebookClick = () => {
    window.open('https://www.facebook.com/md.habibur.rahman.62356', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <MessageCircle className="h-12 w-12 text-[oklch(0.55_0.25_250)]" />
            </div>
            <CardTitle className="text-3xl text-center">Support Center</CardTitle>
            <CardDescription className="text-center">
              We're here to help! Contact us for any questions or concerns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Facebook Contact */}
            <div className="text-center p-8 bg-gradient-to-br from-[oklch(0.65_0.25_250)] to-[oklch(0.45_0.20_260)] rounded-lg text-white">
              <SiFacebook className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Contact Us on Facebook</h3>
              <p className="mb-6 text-white/90">
                Get instant support by messaging us on Facebook
              </p>
              <Button
                onClick={handleFacebookClick}
                size="lg"
                className="bg-white text-[oklch(0.55_0.25_250)] hover:bg-white/90 font-semibold"
              >
                <SiFacebook className="mr-2 h-5 w-5" />
                Message on Facebook
              </Button>
            </div>

            {/* Support Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 border rounded-lg">
                <Clock className="h-8 w-8 mb-3 text-[oklch(0.55_0.25_250)]" />
                <h3 className="font-semibold mb-2">Response Time</h3>
                <p className="text-sm text-muted-foreground">
                  We typically respond within 1-2 hours during business hours
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <HelpCircle className="h-8 w-8 mb-3 text-[oklch(0.55_0.25_250)]" />
                <h3 className="font-semibold mb-2">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">
                  Our support team is available around the clock to assist you
                </p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>
              <div className="space-y-3">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-1">How do I withdraw my earnings?</h4>
                  <p className="text-sm text-muted-foreground">
                    Visit the Withdraw page and submit a withdrawal request with your payment details.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-1">How does the referral system work?</h4>
                  <p className="text-sm text-muted-foreground">
                    Share your unique referral link with friends. When they sign up and complete tasks, you earn bonus rewards.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-1">How many tasks can I complete daily?</h4>
                  <p className="text-sm text-muted-foreground">
                    You can complete 10+ daily tasks. New tasks are added regularly.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
