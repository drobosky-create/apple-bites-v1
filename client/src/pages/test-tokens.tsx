import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, Shield } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export default function TestTokens() {
  const [tokenType, setTokenType] = useState<'basic' | 'growth'>('basic');
  const [ghlContactId, setGhlContactId] = useState('');
  const [generatedToken, setGeneratedToken] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateToken = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await apiRequest('POST', '/api/generate-token', {
        type: tokenType,
        ghlContactId: ghlContactId || undefined
      });
      
      const data = await response.json();
      setGeneratedToken(data);
    } catch (err) {
      setError('Failed to generate token');
      console.error('Token generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openAssessmentUrl = () => {
    if (generatedToken?.assessmentUrl) {
      window.open(generatedToken.assessmentUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a2332] mb-2">Token Generation Test</h1>
          <p className="text-gray-600">
            Test the GHL token-based access system for assessments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Token Generation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Generate Access Token
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tokenType">Assessment Type</Label>
                <Select value={tokenType} onValueChange={(value: 'basic' | 'growth') => setTokenType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assessment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic Assessment (Free)</SelectItem>
                    <SelectItem value="growth">Growth & Exit Assessment ($795)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ghlContactId">GHL Contact ID (Optional)</Label>
                <Input
                  id="ghlContactId"
                  value={ghlContactId}
                  onChange={(e) => setGhlContactId(e.target.value)}
                  placeholder="Enter GHL contact ID..."
                />
              </div>

              <Button 
                onClick={generateToken}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate Token'}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Token Results */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Token</CardTitle>
            </CardHeader>
            <CardContent>
              {generatedToken ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Access Token</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generatedToken.token)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-gray-100 p-3 rounded text-sm font-mono break-all">
                      {generatedToken.token}
                    </div>
                  </div>

                  <div>
                    <Label>Type</Label>
                    <div className="mt-1">
                      <Badge variant={generatedToken.type === 'growth' ? 'default' : 'secondary'}>
                        {generatedToken.type}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label>Expires At</Label>
                    <div className="text-sm text-gray-600 mt-1">
                      {new Date(generatedToken.expiresAt).toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Assessment URL</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openAssessmentUrl}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Test
                      </Button>
                    </div>
                    <div className="bg-gray-100 p-3 rounded text-sm break-all">
                      {generatedToken.assessmentUrl}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Generate a token to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>GHL Integration Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Step 1: Token Generation</h4>
                <p className="text-sm text-gray-600">
                  Use the <code className="bg-gray-100 px-2 py-1 rounded">POST /api/generate-token</code> endpoint
                  with the assessment type and optional GHL contact ID.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Step 2: URL Distribution</h4>
                <p className="text-sm text-gray-600">
                  Send the generated assessment URL to users via GHL automation. The URL includes the access token.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Step 3: Assessment Access</h4>
                <p className="text-sm text-gray-600">
                  Users click the URL and are automatically validated and redirected to the appropriate assessment.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Example API Call:</h4>
                <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                  {`curl -X POST https://your-domain.com/api/generate-token \\
  -H "Content-Type: application/json" \\
  -d '{"type": "growth", "ghlContactId": "contact_123"}'`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}