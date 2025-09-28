'use client';

import { useAuth } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2, ShieldCheck, Dumbbell } from 'lucide-react';
import { UserRole } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);
  
  const handleDemoLogin = (role: UserRole) => {
    setIsSubmitting(true);
    setTimeout(() => {
      login(role);
      toast({
        title: 'Login Successful',
        description: `Welcome! You are logged in as a ${role}.`,
      });
      router.push('/dashboard');
      setIsSubmitting(false);
    }, 500);
  };

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    // For demo, just log in as athlete. In a real app, you'd authenticate.
    handleDemoLogin('athlete');
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Dumbbell className="h-8 w-8" />
          </div>
          <h1 className="font-headline text-3xl font-bold text-foreground">Athlete Sentinel</h1>
          <CardDescription>AI-Powered Athlete Monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
              OR
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-center text-sm font-medium text-muted-foreground">
              Sign in as a demo user
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Button variant="outline" onClick={() => handleDemoLogin('athlete')} disabled={isSubmitting}>Athlete</Button>
              <Button variant="outline" onClick={() => handleDemoLogin('coach')} disabled={isSubmitting}>Coach</Button>
              <Button variant="outline" onClick={() => handleDemoLogin('physiotherapist')} disabled={isSubmitting}>Physio</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
