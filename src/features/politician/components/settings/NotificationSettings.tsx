import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Mail, Smartphone, Bell, Loader2, Check } from "lucide-react";

interface NotificationSettingsProps {
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    newsletter: boolean;
    twoFactorAuth: boolean;
    publicProfile: boolean;
  };
  onPreferenceChange: (key: string, value: boolean) => void;
  isSaving: boolean;
  onSave: () => void;
}

export function NotificationSettings({
  preferences,
  onPreferenceChange,
  isSaving,
  onSave,
}: NotificationSettingsProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Manage how you receive email updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="email-notifications">Email Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Receive email notifications about your account activity
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) =>
                onPreferenceChange("emailNotifications", checked)
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="newsletter">Newsletter</Label>
              <p className="text-sm text-muted-foreground">
                Get updates about new features and platform news
              </p>
            </div>
            <Switch
              id="newsletter"
              checked={preferences.newsletter}
              onCheckedChange={(checked) =>
                onPreferenceChange("newsletter", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SMS & Push Notifications</CardTitle>
          <CardDescription>
            Control mobile and text message alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Receive text messages for important updates
              </p>
            </div>
            <Switch
              id="sms-notifications"
              checked={preferences.smsNotifications}
              onCheckedChange={(checked) =>
                onPreferenceChange("smsNotifications", checked)
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="push-notifications">Push Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Receive push notifications on your devices
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={preferences.pushNotifications}
              onCheckedChange={(checked) =>
                onPreferenceChange("pushNotifications", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={onSave} disabled={isSaving}>
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            Save Notification Preferences
          </>
        )}
      </Button>
    </>
  );
}
