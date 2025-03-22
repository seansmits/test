import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');

export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has already dismissed the popup or subscribed
    const hasInteracted = localStorage.getItem('newsletter_interaction');
    
    if (!hasInteracted) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setOpen(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    // Store that user has interacted with the popup
    localStorage.setItem('newsletter_interaction', 'dismissed');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    try {
      emailSchema.parse(email);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError('Please enter a valid email address');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      // Success
      toast({
        title: "Success!",
        description: data.message || "You've been subscribed to the newsletter.",
        variant: "default",
      });
      
      // Store that user has subscribed
      localStorage.setItem('newsletter_interaction', 'subscribed');
      setOpen(false);
    } catch (err) {
      let errorMessage = 'Failed to subscribe to the newsletter';
      
      // Handle known error types
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      // Handle duplicate email (either from message or PostgreSQL error code)
      if (errorMessage.includes('already subscribed')) {
        toast({
          title: "Already subscribed",
          description: "This email is already on our newsletter list.",
          variant: "default",
        });
        localStorage.setItem('newsletter_interaction', 'subscribed');
        setOpen(false);
        return;
      }
      
      // Handle server errors
      if (errorMessage.includes('try again later')) {
        toast({
          title: "Server Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="absolute right-4 top-4">
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0 rounded-full" 
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <DialogHeader>
          <DialogTitle className="text-2xl">Stay Updated!</DialogTitle>
          <DialogDescription>
            Subscribe to my newsletter to receive updates on new projects and tech insights.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-left">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                className={error ? 'border-red-500' : ''}
              />
              {error && (
                <p className="text-sm font-medium text-red-500">{error}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}