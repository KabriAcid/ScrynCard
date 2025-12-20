import { Suspense } from "react";
import { Bell, Mail, MessageSquare } from "lucide-react";
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

async function NotificationsContent() {
  await simulateDelay(800);

  const templates = [
    {
      id: "1",
      name: "Redemption Success",
      channel: "Email & SMS",
      status: "Active",
    },
    {
      id: "2",
      name: "Fraud Alert",
      channel: "Email",
      status: "Active",
    },
    {
      id: "3",
      name: "Welcome Message",
      channel: "SMS",
      status: "Active",
    },
  ];

  const deliveryLogs = [
    {
      id: "1",
      type: "Email",
      recipient: "user@example.com",
      template: "Redemption Success",
      status: "Delivered",
      time: new Date(Date.now() - 5 * 60000),
    },
    {
      id: "2",
      type: "SMS",
      recipient: "+234***1234",
      template: "Fraud Alert",
      status: "Delivered",
      time: new Date(Date.now() - 15 * 60000),
    },
    {
      id: "3",
      type: "Email",
      recipient: "admin@scryn.com",
      template: "Welcome Message",
      status: "Failed",
      time: new Date(Date.now() - 30 * 60000),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notification Center</h1>
        <p className="mt-2 text-muted-foreground">
          Manage notification templates and delivery
        </p>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">
            <MessageSquare className="mr-2 h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="logs">
            <Mail className="mr-2 h-4 w-4" />
            Delivery Logs
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Bell className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Notification Templates</h2>
              <p className="text-sm text-muted-foreground">
                Manage email and SMS templates
              </p>
            </div>
            <Button>Create Template</Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {template.channel}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="default">{template.status}</Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Logs</CardTitle>
              <CardDescription>
                Recent notification delivery history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveryLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{log.type}</Badge>
                        <p className="text-sm font-medium">{log.template}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        To: {log.recipient} • {log.time.toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        log.status === "Delivered" ? "default" : "destructive"
                      }
                    >
                      {log.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure notification channels and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via email
                    </p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via SMS
                    </p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Send push notifications
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

export default function NotificationsPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <NotificationsContent />
    </Suspense>
  );
}
