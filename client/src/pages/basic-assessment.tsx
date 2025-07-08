import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Lock, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiRequest } from '@/lib/queryClient';

export default function BasicAssessment() {
  const [, setLocation] = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [tokenValidated, setTokenValidated] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    
    if (!tokenParam) {
      setLocation('/');
      return;
    }
    
    setToken(tokenParam);
  }, [setLocation]);

  // Validate token on mount
  const { data: validation, isLoading, error } = useQuery({
    queryKey: ['validate-token', token],
    queryFn: async () => {
      if (!token) return null;
      
      const response = await apiRequest('POST', '/api/validate-token', { token });
      return response.json();
    },
    enabled: !!token,
    retry: false
  });

  useEffect(() => {
    if (validation?.valid) {
      setTokenValidated(true);
    }
  }, [validation]);

  const handleStartAssessment = () => {
    // Redirect to the existing free assessment with token
    setLocation(`/assessment/free?token=${token}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Validating access...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !validation?.valid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Lock className="w-5 h-5 mr-2" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error ? 'Invalid or expired access token' : 'Access token required'}
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => setLocation('/')}
              className="w-full mt-4"
              variant="outline"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tokenValidated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Preparing assessment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 mr-2" />
            <h1 className="text-3xl font-bold text-[#1a2332]">Basic Business Assessment</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Complete your comprehensive business valuation analysis
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Ready to Begin</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Your access has been validated. Click below to start your free basic assessment.
            </p>
            <Button 
              onClick={handleStartAssessment}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              size="lg"
            >
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}