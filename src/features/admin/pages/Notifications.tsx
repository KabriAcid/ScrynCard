import { useState, useMemo } from "react";
import {
  Bell,
  Mail,
  MessageSquare,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  AlertTriangle,
  Activity,
  TrendingUp,
  Edit,
  Trash2,
  Copy,
  Eye,
  ToggleLeft,
  ToggleRight,
  Settings,
  Zap,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

// Types
interface NotificationTemplate {
  id: string;
  name: string;
  description: string;
  channel: "email" | "sms" | "push" | "all";
  trigger: string;
  status: "active" | "inactive" | "draft";
  lastUpdated: string;
  sentCount: number;
  successRate: number;
}

interface DeliveryLog {
  id: string;
  type: "email" | "sms" | "push";
  recipient: string;
  recipientName: string;
  template: string;
  subject?: string;
  status: "delivered" | "pending" | "failed" | "bounced";
  time: string;
  errorMessage?: string;
}

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  channel: "email" | "sms" | "push";
  enabled: boolean;
  provider?: string;
  lastTested?: string;
}

// Mock data
const mockTemplates: NotificationTemplate[] = [
  {
    id: "1",
    name: "Redemption Success",
    description: "Sent when a citizen successfully redeems a scratch card",
    channel: "all",
    trigger: "redemption.completed",
    status: "active",
    lastUpdated: "2024-12-20T10:30:00Z",
    sentCount: 1523,
    successRate: 98.5,
  },
  {
    id: "2",
    name: "Fraud Alert",
    description: "Immediate notification when suspicious activity is detected",
    channel: "email",
    trigger: "fraud.detected",
    status: "active",
    lastUpdated: "2024-12-18T14:20:00Z",
    sentCount: 47,
    successRate: 100,
  },
  {
    id: "3",
    name: "Welcome Message",
    description: "Greeting message for newly registered citizens",
    channel: "sms",
    trigger: "citizen.registered",
    status: "active",
    lastUpdated: "2024-12-15T09:00:00Z",
    sentCount: 2890,
    successRate: 95.2,
  },
  {
    id: "4",
    name: "Order Confirmation",
    description: "Confirms politician card orders with order details",
    channel: "email",
    trigger: "order.created",
    status: "active",
    lastUpdated: "2024-12-22T16:45:00Z",
    sentCount: 342,
    successRate: 99.1,
  },
  {
    id: "5",
    name: "Campaign Launch",
    description: "Notifies politicians when their campaign goes live",
    channel: "all",
    trigger: "campaign.activated",
    status: "active",
    lastUpdated: "2024-12-10T11:30:00Z",
    sentCount: 89,
    successRate: 97.8,
  },
  {
    id: "6",
    name: "KYC Verification Required",
    description: "Reminder to complete identity verification",
    channel: "sms",
    trigger: "kyc.pending",
    status: "inactive",
    lastUpdated: "2024-12-05T08:15:00Z",
    sentCount: 567,
    successRate: 92.3,
  },
  {
    id: "7",
    name: "Low Card Stock Alert",
    description: "Warns politicians when campaign cards are running low",
    channel: "email",
    trigger: "cards.low_stock",
    status: "draft",
    lastUpdated: "2024-12-25T13:00:00Z",
    sentCount: 0,
    successRate: 0,
  },
];

const mockDeliveryLogs: DeliveryLog[] = [
  {
    id: "1",
    type: "email",
    recipient: "amina.ibrahim@gmail.com",
    recipientName: "Amina Ibrahim",
    template: "Redemption Success",
    subject: "Your ₦5,000 has been credited!",
    status: "delivered",
    time: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: "2",
    type: "sms",
    recipient: "+2348012345678",
    recipientName: "Yusuf Abdullahi",
    template: "Fraud Alert",
    status: "delivered",
    time: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: "3",
    type: "email",
    recipient: "admin@scryn.ng",
    recipientName: "System Admin",
    template: "Welcome Message",
    subject: "Welcome to Scryncard Platform",
    status: "failed",
    time: new Date(Date.now() - 30 * 60000).toISOString(),
    errorMessage: "Invalid email address",
  },
  {
    id: "4",
    type: "sms",
    recipient: "+2349087654321",
    recipientName: "Fatima Suleiman",
    template: "Redemption Success",
    status: "delivered",
    time: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: "5",
    type: "email",
    recipient: "campaign@apc.ng",
    recipientName: "APC Campaign Office",
    template: "Order Confirmation",
    subject: "Order #ORD-2024-0342 Confirmed",
    status: "delivered",
    time: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: "6",
    type: "push",
    recipient: "device_token_abc123",
    recipientName: "Musa Danladi",
    template: "Campaign Launch",
    status: "pending",
    time: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: "7",
    type: "sms",
    recipient: "+2347098765432",
    recipientName: "Hauwa Mohammed",
    template: "KYC Verification Required",
    status: "bounced",
    time: new Date(Date.now() - 120 * 60000).toISOString(),
    errorMessage: "Phone number not reachable",
  },
  {
    id: "8",
    type: "email",
    recipient: "abubakar.sadiq@yahoo.com",
    recipientName: "Abubakar Sadiq",
    template: "Redemption Success",
    subject: "Your ₦10,000 has been credited!",
    status: "delivered",
    time: new Date(Date.now() - 180 * 60000).toISOString(),
  },
];

const mockSettings: NotificationSetting[] = [
  {
    id: "1",
    name: "Email Notifications",
    description: "Send transactional emails via SMTP/API",
    channel: "email",
    enabled: true,
    provider: "SendGrid",
    lastTested: "2024-12-27T10:00:00Z",
  },
  {
    id: "2",
    name: "SMS Notifications",
    description: "Send SMS messages to Nigerian numbers",
    channel: "sms",
    enabled: true,
    provider: "Termii",
    lastTested: "2024-12-27T09:30:00Z",
  },
  {
    id: "3",
    name: "Push Notifications",
    description: "Send mobile push notifications",
    channel: "push",
    enabled: false,
    provider: "Firebase",
    lastTested: "2024-12-20T14:00:00Z",
  },
];

// Skeleton Loading Component
function NotificationsPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI Skeletons */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <Skeleton className="h-10 w-80" />

      {/* Content Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NotificationsPage() {
  const [isLoading] = useState(false);

  // Templates state
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateStatusFilter, setTemplateStatusFilter] = useState("all");
  const [templateChannelFilter, setTemplateChannelFilter] = useState("all");

  // Logs state
  const [logSearch, setLogSearch] = useState("");
  const [logStatusFilter, setLogStatusFilter] = useState("all");
  const [logTypeFilter, setLogTypeFilter] = useState("all");
  const [currentLogPage, setCurrentLogPage] = useState(1);
  const logsPerPage = 5;

  // Settings state
  const [settings, setSettings] = useState(mockSettings);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalSent = mockDeliveryLogs.length;
    const delivered = mockDeliveryLogs.filter(
      (l) => l.status === "delivered"
    ).length;
    const failed = mockDeliveryLogs.filter(
      (l) => l.status === "failed" || l.status === "bounced"
    ).length;
    const pending = mockDeliveryLogs.filter(
      (l) => l.status === "pending"
    ).length;
    const activeTemplates = mockTemplates.filter(
      (t) => t.status === "active"
    ).length;
    const avgSuccessRate =
      mockTemplates
        .filter((t) => t.sentCount > 0)
        .reduce((sum, t) => sum + t.successRate, 0) /
        mockTemplates.filter((t) => t.sentCount > 0).length || 0;

    return {
      totalSent,
      delivered,
      failed,
      pending,
      activeTemplates,
      avgSuccessRate: avgSuccessRate.toFixed(1),
    };
  }, []);

  // Filtered templates
  const filteredTemplates = useMemo(() => {
    return mockTemplates.filter((template) => {
      const matchesSearch =
        templateSearch === "" ||
        template.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
        template.description
          .toLowerCase()
          .includes(templateSearch.toLowerCase());
      const matchesStatus =
        templateStatusFilter === "all" ||
        template.status === templateStatusFilter;
      const matchesChannel =
        templateChannelFilter === "all" ||
        template.channel === templateChannelFilter;
      return matchesSearch && matchesStatus && matchesChannel;
    });
  }, [templateSearch, templateStatusFilter, templateChannelFilter]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return mockDeliveryLogs.filter((log) => {
      const matchesSearch =
        logSearch === "" ||
        log.recipientName.toLowerCase().includes(logSearch.toLowerCase()) ||
        log.recipient.toLowerCase().includes(logSearch.toLowerCase()) ||
        log.template.toLowerCase().includes(logSearch.toLowerCase());
      const matchesStatus =
        logStatusFilter === "all" || log.status === logStatusFilter;
      const matchesType = logTypeFilter === "all" || log.type === logTypeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [logSearch, logStatusFilter, logTypeFilter]);

  // Pagination for logs
  const totalLogPages = Math.ceil(filteredLogs.length / logsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentLogPage - 1) * logsPerPage,
    currentLogPage * logsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="secondary">
            <XCircle className="mr-1 h-3 w-3" />
            Inactive
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline">
            <Edit className="mr-1 h-3 w-3" />
            Draft
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            Delivered
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        );
      case "bounced":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Bounced
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case "email":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            <Mail className="mr-1 h-3 w-3" />
            Email
          </Badge>
        );
      case "sms":
        return (
          <Badge variant="outline" className="border-green-500 text-green-600">
            <Smartphone className="mr-1 h-3 w-3" />
            SMS
          </Badge>
        );
      case "push":
        return (
          <Badge
            variant="outline"
            className="border-purple-500 text-purple-600"
          >
            <Bell className="mr-1 h-3 w-3" />
            Push
          </Badge>
        );
      case "all":
        return (
          <Badge
            variant="outline"
            className="border-orange-500 text-orange-600"
          >
            <Zap className="mr-1 h-3 w-3" />
            All Channels
          </Badge>
        );
      default:
        return <Badge variant="outline">{channel}</Badge>;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return <Mail className="h-5 w-5 text-blue-500" />;
      case "sms":
        return <Smartphone className="h-5 w-5 text-green-500" />;
      case "push":
        return <Bell className="h-5 w-5 text-purple-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Notification Center</h1>
          <p className="mt-2 text-muted-foreground">
            Manage notification templates and delivery
          </p>
        </div>
        <NotificationsPageSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notification Center</h1>
          <p className="mt-2 text-muted-foreground">
            Manage templates, monitor delivery, and configure channels
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.totalSent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {kpis.activeTemplates} active templates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {kpis.delivered.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {kpis.totalSent > 0
                ? Math.round((kpis.delivered / kpis.totalSent) * 100)
                : 0}
              % delivery rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {kpis.failed.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {kpis.pending} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.avgSuccessRate}%</div>
            <p className="text-xs text-muted-foreground">
              Average across templates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="templates" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Delivery Logs</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={templateStatusFilter}
              onValueChange={setTemplateStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={templateChannelFilter}
              onValueChange={setTemplateChannelFilter}
            >
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="push">Push</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Templates Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="group hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </div>
                    {getStatusBadge(template.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Channel</span>
                    {getChannelBadge(template.channel)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Trigger</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {template.trigger}
                    </code>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold">
                        {template.sentCount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Sent</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">
                        {template.successRate > 0
                          ? `${template.successRate}%`
                          : "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">Success</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Updated {formatTimeAgo(template.lastUpdated)}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  No Templates Found
                </h3>
                <p className="text-muted-foreground">
                  {templateSearch ||
                  templateStatusFilter !== "all" ||
                  templateChannelFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first notification template"}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Delivery Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={logSearch}
                onChange={(e) => {
                  setLogSearch(e.target.value);
                  setCurrentLogPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={logStatusFilter}
              onValueChange={(value) => {
                setLogStatusFilter(value);
                setCurrentLogPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="bounced">Bounced</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={logTypeFilter}
              onValueChange={(value) => {
                setLogTypeFilter(value);
                setCurrentLogPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="push">Push</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Logs ({filteredLogs.length})</CardTitle>
              <CardDescription>
                Recent notification delivery history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paginatedLogs.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Template</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getChannelIcon(log.type)}
                              <span className="capitalize">{log.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{log.recipientName}</p>
                              <p className="text-xs text-muted-foreground">
                                {log.type === "email"
                                  ? log.recipient
                                  : `***${log.recipient.slice(-4)}`}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{log.template}</p>
                              {log.subject && (
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {log.subject}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              {getDeliveryStatusBadge(log.status)}
                              {log.errorMessage && (
                                <p className="text-xs text-red-500 mt-1">
                                  {log.errorMessage}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatTimeAgo(log.time)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {totalLogPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-muted-foreground">
                        Showing {(currentLogPage - 1) * logsPerPage + 1} to{" "}
                        {Math.min(
                          currentLogPage * logsPerPage,
                          filteredLogs.length
                        )}{" "}
                        of {filteredLogs.length} logs
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentLogPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentLogPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">
                          Page {currentLogPage} of {totalLogPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentLogPage((p) =>
                              Math.min(totalLogPages, p + 1)
                            )
                          }
                          disabled={currentLogPage === totalLogPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No Logs Found</h3>
                  <p className="text-muted-foreground">
                    {logSearch ||
                    logStatusFilter !== "all" ||
                    logTypeFilter !== "all"
                      ? "Try adjusting your filters"
                      : "No notifications have been sent yet"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Channel Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Notification Channels
                </CardTitle>
                <CardDescription>
                  Configure notification delivery channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {settings.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-start gap-4">
                      {getChannelIcon(setting.channel)}
                      <div className="space-y-1">
                        <p className="font-medium">{setting.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {setting.description}
                        </p>
                        {setting.provider && (
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              Provider: {setting.provider}
                            </Badge>
                            {setting.lastTested && (
                              <span className="text-xs text-muted-foreground">
                                Tested {formatTimeAgo(setting.lastTested)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="mr-1 h-3 w-3" />
                        Test
                      </Button>
                      <Switch
                        checked={setting.enabled}
                        onCheckedChange={() => toggleSetting(setting.id)}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common notification management tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Template
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Test All Channels
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="mr-2 h-4 w-4" />
                  View Failed Deliveries
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Old Logs
                </Button>

                <Separator />

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Delivery Stats (24h)</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xl font-bold text-green-600">
                        {kpis.delivered}
                      </p>
                      <p className="text-xs text-muted-foreground">Delivered</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-yellow-600">
                        {kpis.pending}
                      </p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-red-600">
                        {kpis.failed}
                      </p>
                      <p className="text-xs text-muted-foreground">Failed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Configuration */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Provider Configuration
                </CardTitle>
                <CardDescription>
                  API credentials and provider settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">SendGrid</span>
                      </div>
                      <Badge className="bg-green-600">Connected</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Email delivery provider
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Configure
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Termii</span>
                      </div>
                      <Badge className="bg-green-600">Connected</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      SMS delivery provider
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Configure
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-purple-500" />
                        <span className="font-medium">Firebase</span>
                      </div>
                      <Badge variant="secondary">Not Connected</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Push notifications provider
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Connect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
