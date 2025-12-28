import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderCircle, ShieldAlert, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function FraudAnalysisPage() {
  const [json, setJson] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzePattern = async () => {
    if (!json.trim()) {
      alert("Please paste valid JSON data");
      return;
    }

    try {
      setLoading(true);
      // Simulate AI analysis with mock data
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const result = {
        riskScore: Math.floor(Math.random() * 100),
        flagged: Math.floor(Math.random() * 100) > 50,
        findings: [
          "Multiple transactions from same IP address",
          "Same bank account used for multiple cards",
          "Transactions within short time window",
        ],
        recommendation: "Review for manual verification",
      };

      setAnalysis(result);
    } catch (error) {
      alert("Error analyzing data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fraud Detection Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Paste Redemption Data (JSON)
          </label>
          <Textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            placeholder={exampleJson}
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        <Button onClick={analyzePattern} disabled={loading} className="w-full">
          {loading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Pattern"
          )}
        </Button>

        {analysis && (
          <Alert
            className={cn(
              analysis.flagged && "border-red-500 bg-red-50 dark:bg-red-950"
            )}
          >
            <AlertTitle className="flex items-center gap-2">
              {analysis.flagged ? (
                <>
                  <ShieldAlert className="h-5 w-5 text-red-500" />
                  Fraud Risk Detected
                </>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  Low Risk
                </>
              )}
            </AlertTitle>
            <AlertDescription className="space-y-4 mt-2">
              <div>
                <div className="text-sm font-medium mb-1">
                  Risk Score: {analysis.riskScore}%
                </div>
                <Progress value={analysis.riskScore} className="h-2" />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Findings:</p>
                <ul className="text-sm space-y-1 ml-4 list-disc">
                  {analysis.findings.map((f: string, i: number) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
              <p className="text-sm font-medium">{analysis.recommendation}</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
