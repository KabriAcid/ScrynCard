import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  EyeOff,
  Shield,
  Key,
  Loader2,
  Check,
  AlertTriangle,
} from "lucide-react";

interface SecuritySettingsProps {
  preferences: {
    twoFactorAuth: boolean;
  };
  onPreferenceChange: (key: string, value: boolean) => void;
  isSaving: boolean;
  onPasswordChange: () => void;
  onSave: () => void;
}

export function SecuritySettings({
  preferences,
  onPreferenceChange,
  isSaving,
  onPasswordChange,
  onSave,
}: SecuritySettingsProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters with uppercase, lowercase, and
              numbers
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
            />
          </div>

          <Button onClick={onPasswordChange} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Key className="mr-2 h-4 w-4" />
                Update Password
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Require a code from your phone in addition to your password
              </p>
            </div>
            <Switch
              id="two-factor"
              checked={preferences.twoFactorAuth}
              onCheckedChange={(checked) =>
                onPreferenceChange("twoFactorAuth", checked)
              }
            />
          </div>

          {preferences.twoFactorAuth && (
            <>
              <Separator />
              <div className="rounded-lg border p-4 space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Two-Factor Authentication is Enabled
                </h4>
                <p className="text-sm text-muted-foreground">
                  Your account is protected with 2FA. You'll need to enter a
                  code from your authenticator app when signing in.
                </p>
                <Button variant="outline" size="sm">
                  View Recovery Codes
                </Button>
              </div>
            </>
          )}

          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Security Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">
            Active Sessions
          </CardTitle>
          <CardDescription>
            Manage devices that are logged into your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start justify-between p-3 rounded-lg border">
              <div className="space-y-1">
                <p className="font-medium text-sm">Windows • Chrome</p>
                <p className="text-xs text-muted-foreground">Lagos, Nigeria</p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Current Session
                </p>
              </div>
              <Button variant="ghost" size="sm" disabled>
                Active
              </Button>
            </div>
            <Button variant="destructive" className="w-full">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Sign Out All Other Sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
