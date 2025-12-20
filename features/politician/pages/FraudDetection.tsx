import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FraudAnalysisClient } from './fraud-analysis-client';

export default function FraudDetectionPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Fraud Detection</CardTitle>
          <CardDescription>
            Analyze redemption patterns for fraudulent activity using our advanced AI model. Paste the redemption data in JSON format below to get a risk assessment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FraudAnalysisClient />
        </CardContent>
      </Card>
    </div>
  );
}
