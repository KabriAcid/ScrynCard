import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { getUserProfileByEmail, getDemoUserProfile } from "@/lib/mock";
import type { UserProfile } from "@/lib/mock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Settings, Bell, Shield, Eye } from "lucide-react";
import {
  AccountSettings,
  NotificationSettings,
  SecuritySettings,
  PrivacySettings,
} from "../components/settings";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const userProfile: UserProfile = user?.email
    ? getUserProfileByEmail(user.email) || getDemoUserProfile()
    : getDemoUserProfile();

  const [preferences, setPreferences] = useState(
    userProfile.preferences || {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      newsletter: true,
      twoFactorAuth: false,
      publicProfile: true,
    }
  );

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handlePasswordChange = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences({ ...preferences, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Eye className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <AccountSettings
            userProfile={userProfile}
            isSaving={isSaving}
            onSave={handleSaveSettings}
          />
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings
            preferences={preferences}
            onPreferenceChange={handlePreferenceChange}
            isSaving={isSaving}
            onSave={handleSaveSettings}
          />
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <SecuritySettings
            preferences={preferences}
            onPreferenceChange={handlePreferenceChange}
            isSaving={isSaving}
            onPasswordChange={handlePasswordChange}
            onSave={handleSaveSettings}
          />
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <PrivacySettings
            preferences={preferences}
            onPreferenceChange={handlePreferenceChange}
            isSaving={isSaving}
            onSave={handleSaveSettings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
