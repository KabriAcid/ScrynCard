'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { analyzeRedemption } from './actions';
import type { FraudDetectionOutput } from '@/ai/flows/fraud-detection-ai';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LoaderCircle, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const exampleJson = `{
  "transactions": [
    {
      "cardCode": "A1B2-C3D4-E5F6-G7H8",
      "bankAccountNumber": "0123456789",
      "bankName": "First Bank",
      "timestamp": "2024-05-20T10:00:00Z",
      "ipAddress": "192.168.1.1"
    },
    {
      "cardCode": "I9J0-K1L2-M3N4-O5P6",
      "bankAccountNumber": "0123456789",
      "bankName": "First Bank",
      "timestamp": "2024-05-20T10:01:00Z",
      "ipAddress": "192.168.1.1"
    }
  ]
}`;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Analyze Pattern'
      )}
    </Button>
  );
}

export function FraudAnalysisClient() {
  const [result, setResult] = useState<FraudDetectionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(formData: FormData) {
    setResult(null);
    setError(null);
    const redemptionData = formData.get('redemptionData') as string;
    const response = await analyzeRedemption(redemptionData);
    if (response.error) {
      setError(response.error);
    } else {
      setResult(response.data);
    }
  }

  const getRiskColor = (score: number) => {
    if (score > 75) return 'hsl(var(--destructive))';
    if (score > 40) return 'hsl(var(--primary))';
    return 'hsl(var(--accent))';
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form action={handleAction} className="space-y-4">
        <Textarea
          name="redemptionData"
          placeholder="Paste redemption data JSON here..."
          className="min-h-[300px] font-mono text-xs"
          defaultValue={exampleJson}
        />
        <SubmitButton />
      </form>
      <div>
        {result ? (
          <Card className={cn(
            'border-2',
            result.isFraudulent ? 'border-destructive' : 'border-green-500'
          )}>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                {result.isFraudulent ? <ShieldAlert className="h-8 w-8 text-destructive" /> : <ShieldCheck className="h-8 w-8 text-green-500" />}
              <div>
                <CardTitle className="text-xl">
                  {result.isFraudulent ? 'Fraudulent Pattern Detected' : 'Pattern Appears Normal'}
                </CardTitle>
                <div className="flex items-center gap-2 pt-2">
                    <p className="text-sm font-medium">Risk Score: {result.riskScore}</p>
                    <Progress value={result.riskScore} className="w-40" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{result.fraudExplanation}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex h-full min-h-[300px] items-center justify-center rounded-lg border border-dashed">
            <div className="text-center text-muted-foreground">
              <Shield className="mx-auto h-12 w-12" />
              <p className="mt-2">Analysis results will appear here</p>
            </div>
          </div>
        )}
        {error && (
            <Alert variant="destructive" className="mt-4">
            <AlertTitle>Analysis Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
      </div>
    </div>
  );
}
