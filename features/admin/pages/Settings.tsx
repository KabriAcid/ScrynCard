import { Suspense } from "react";
import { Settings as SettingsIcon, Shield, Users, Key } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardSkeleton } from "@/components/dashboard/skeletons";
import { simulateDelay } from "@/lib/dev-utils";

async function SettingsContent() {
  await simulateDelay(800);

  const adminUsers = [
    {
      id: "1",
      name: "Super Admin",
      email: "admin@scryn.com",
      role: "Super Admin",
      lastActive: new Date(),
    },
    {
      id: "2",
      name: "Operations Manager",
      email: "ops@scryn.com",
      role: "Manager",
      lastActive: new Date(Date.now() - 3600000),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage platform settings and access control
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Admin Users
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Shield className="mr-2 h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="security">
            <Key className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="general">
            <SettingsIcon className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Admin Users</h2>
              <p className="text-sm text-muted-foreground">
                Manage administrator accounts and access
              </p>
            </div>
            <Button>Invite Admin</Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {adminUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge>{user.role}</Badge>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>
                Configure role-based access control
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Super Admin</h3>
                    <Badge>Full Access</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Complete platform control and configuration
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Manager</h3>
                    <Badge variant="secondary">Limited Access</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    View and manage operations, no system config
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security and authentication options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all admin accounts
                    </p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session Timeout</p>
                    <p className="text-sm text-muted-foreground">
                      Auto logout after inactivity
                    </p>
                  </div>
                  <Badge variant="secondary">30 minutes</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Platform-wide configuration options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Platform Name</p>
                    <p className="text-sm text-muted-foreground">Scryn</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Disable access for maintenance
                    </p>
                  </div>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <SettingsContent />
    </Suspense>
  );
}
