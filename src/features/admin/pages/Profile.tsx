import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Edit, 
  Mail, 
  Phone, 
  Calendar,
  Activity,
  Users,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

export default function AdminProfilePage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const displayName = user?.fullName || "Super Admin";
  const displayEmail = user?.email || "admin@scryncard.com";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your administrator account and system access
        </p>
      </div>

      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="relative">
          {/* Cover */}
          <div className="h-32 w-full bg-gradient-to-br from-primary via-primary/80 to-primary/60">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>

          {/* Profile Info */}
          <CardContent className="relative pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12 relative z-10">
              {/* Avatar */}
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  <Shield className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>

              {/* Name & Role */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold">{displayName}</h2>
                  <Badge variant="default" className="gap-1">
                    <Shield className="h-3 w-3" />
                    Super Admin
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Platform Administrator • Full Access
                </p>
              </div>

              {/* Edit Button */}
              <Button onClick={() => setIsEditing(!isEditing)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="access">Access & Permissions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{displayEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">+234 800 000 0000</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Admin Since</p>
                    <p className="text-sm text-muted-foreground">January 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Admin Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Politicians Managed</span>
                  </div>
                  <span className="font-semibold">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Actions This Month</span>
                  </div>
                  <span className="font-semibold">328</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Fraud Alerts Resolved</span>
                  </div>
                  <span className="font-semibold">12</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Status */}
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader>
              <CardTitle className="text-green-600 dark:text-green-400">
                Security Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Two-Factor Authentication Enabled</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Strong Password Policy Active</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Session Monitoring Active</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Audit Logging Enabled</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 pb-3 border-b">
                  <Activity className="h-4 w-4 mt-1 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Reviewed fraud alert #FA-1234</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b">
                  <Users className="h-4 w-4 mt-1 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Approved new politician account</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b">
                  <Shield className="h-4 w-4 mt-1 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Updated security settings</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access & Permissions Tab */}
        <TabsContent value="access" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Manage Politicians</span>
                <Badge variant="default">Full Access</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Review Fraud Alerts</span>
                <Badge variant="default">Full Access</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Platform Analytics</span>
                <Badge variant="default">Full Access</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">System Settings</span>
                <Badge variant="default">Full Access</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">User Management</span>
                <Badge variant="default">Full Access</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
