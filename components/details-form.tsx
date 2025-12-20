"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, CheckCircle, Loader } from "lucide-react";

const nigerianBanks = [
  "Access Bank",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "GTBank",
  "Keystone Bank",
  "Polaris Bank",
  "Stanbic IBTC",
  "Standard Chartered",
  "Sterling Bank",
  "Union Bank",
  "UBA",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
];

export function DetailsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bankName: "",
    accountNumber: "",
    nin: "",
    bvn: "",
    state: "",
    agreeToTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate required fields
    if (!formData.fullName || !formData.phone || !formData.bankName || !formData.accountNumber) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions");
      setIsLoading(false);
      return;
    }

    // Simulate submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4 text-center py-8">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
        <h3 className="text-lg font-semibold">Details Submitted!</h3>
        <p className="text-muted-foreground">
          Your details have been saved. You can now redeem your card.
        </p>
        <Button className="w-full" asChild>
          <a href="/redeem">Continue to Redemption</a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="e.g., John Doe"
            value={formData.fullName}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="e.g., 08012345678"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email (Optional)</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="e.g., john@example.com"
          value={formData.email}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nin">NIN (Optional)</Label>
          <Input
            id="nin"
            name="nin"
            placeholder="11223344556"
            value={formData.nin}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bvn">BVN (Optional)</Label>
          <Input
            id="bvn"
            name="bvn"
            placeholder="12345678901"
            value={formData.bvn}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Select value={formData.state} onValueChange={(v) => handleSelectChange("state", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Lagos">Lagos</SelectItem>
            <SelectItem value="Abuja">Abuja (FCT)</SelectItem>
            <SelectItem value="Rivers">Rivers</SelectItem>
            <SelectItem value="Kano">Kano</SelectItem>
            <SelectItem value="Oyo">Oyo</SelectItem>
            <SelectItem value="Enugu">Enugu</SelectItem>
            <SelectItem value="Anambra">Anambra</SelectItem>
            <SelectItem value="Delta">Delta</SelectItem>
            <SelectItem value="Edo">Edo</SelectItem>
            <SelectItem value="Ondo">Ondo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bankName">Bank Name *</Label>
        <Select value={formData.bankName} onValueChange={(v) => handleSelectChange("bankName", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your bank" />
          </SelectTrigger>
          <SelectContent>
            {nigerianBanks.map((bank) => (
              <SelectItem key={bank} value={bank}>
                {bank}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="accountNumber">Account Number *</Label>
        <Input
          id="accountNumber"
          name="accountNumber"
          type="tel"
          placeholder="e.g., 1234567890"
          value={formData.accountNumber}
          onChange={handleInputChange}
          disabled={isLoading}
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="agreeToTerms"
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))
          }
          disabled={isLoading}
        />
        <Label htmlFor="agreeToTerms" className="font-normal cursor-pointer">
          I agree to the terms and conditions
        </Label>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Details"
        )}
      </Button>
    </form>
  );
}
