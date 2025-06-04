import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Mail, Lock } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { loginSchema, type LoginCredentials } from '@shared/schema';

interface TeamLoginProps {
  onLoginSuccess: (user: any) => void;
}

export default function TeamLogin({ onLoginSuccess }: TeamLoginProps) {
  const [error, setError] = useState('');

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginCredentials) => {
      const response = await fetch('/api/team/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid credentials');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setError('');
      onLoginSuccess(data.user);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    setError('');
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="text-center mb-8">
          <img 
            src="/meritage-logo.png?v=2" 
            alt="Meritage Partners" 
            className="h-16 w-auto mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Team Dashboard Access</h1>
          <p className="text-slate-600">Sign in to manage your platform</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        className="bg-slate-50 border-slate-300 focus:bg-slate-100 focus:border-blue-500 focus:ring-blue-500/20 pl-10"
                        disabled={loginMutation.isPending}
                      />
                    </div>
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
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        className="bg-slate-50 border-slate-300 focus:bg-slate-100 focus:border-blue-500 focus:ring-blue-500/20 pl-10"
                        disabled={loginMutation.isPending}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}