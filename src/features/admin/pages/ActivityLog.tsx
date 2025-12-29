import { useState, useMemo } from "react";
import {
  Activity,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Shield,
  CreditCard,
  Gift,
  Settings,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  Filter,
  Calendar,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: "admin" | "politician" | "citizen" | "system";
  action: string;
  category:
    | "auth"
    | "redemption"
    | "card"
    | "campaign"
    | "user"
    | "system"
    | "fraud";
  details: string;
  ipAddress: string;
  userAgent?: string;
  status: "success" | "failed" | "warning";
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// Mock data
const mockActivityLogs: ActivityLog[] = [
  {
    id: "1",
    userId: "admin-1",
    userName: "Super Admin",
    userRole: "admin",
    action: "login",
    category: "auth",
    details: "Admin logged in from new device",
    ipAddress: "105.112.45.123",
    userAgent: "Chrome/120.0 Windows",
    status: "success",
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: "2",
    userId: "citizen-5",
    userName: "Amina Ibrahim",
    userRole: "citizen",
    action: "redemption_completed",
    category: "redemption",
    details: "Redeemed ₦5,000 scratch card to GTBank ****4521",
    ipAddress: "102.89.34.167",
    status: "success",
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: "3",
    userId: "system",
    userName: "System",
    userRole: "system",
    action: "fraud_detected",
    category: "fraud",
    details: "Multiple redemption attempts from same IP detected",
    ipAddress: "197.210.78.45",
    status: "warning",
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: "4",
    userId: "pol-3",
    userName: "Hon. Dikko Umar Radda",
    userRole: "politician",
    action: "order_created",
    category: "card",
    details: "Created new order for 500 cards worth ₦2,500,000",
    ipAddress: "41.203.67.89",
    status: "success",
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: "5",
    userId: "citizen-12",
    userName: "Yusuf Abdullahi",
    userRole: "citizen",
    action: "redemption_failed",
    category: "redemption",
    details: "Bank transfer failed - Invalid account number",
    ipAddress: "102.89.45.78",
    status: "failed",
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: "6",
    userId: "admin-1",
    userName: "Super Admin",
    userRole: "admin",
    action: "user_verified",
    category: "user",
    details: "Verified KYC for citizen: Fatima Suleiman",
    ipAddress: "105.112.45.123",
    status: "success",
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
  },
  {
    id: "7",
    userId: "system",
    userName: "System",
    userRole: "system",
    action: "campaign_activated",
    category: "campaign",
    details: "Campaign 'Katsina Empowerment 2024' auto-activated",
    ipAddress: "127.0.0.1",
    status: "success",
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
  },
  {
    id: "8",
    userId: "pol-5",
    userName: "Sen. Abdullahi Sabi",
    userRole: "politician",
    action: "logout",
    category: "auth",
    details: "Politician logged out",
    ipAddress: "41.203.45.112",
    status: "success",
    createdAt: new Date(Date.now() - 150 * 60000).toISOString(),
  },
  {
    id: "9",
    userId: "admin-1",
    userName: "Super Admin",
    userRole: "admin",
    action: "settings_updated",
    category: "system",
    details: "Updated platform notification settings",
    ipAddress: "105.112.45.123",
    status: "success",
    createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
  },
  {
    id: "10",
    userId: "citizen-8",
    userName: "Hauwa Mohammed",
    userRole: "citizen",
    action: "kyc_submitted",
    category: "user",
    details: "Submitted BVN/NIN for verification",
    ipAddress: "102.89.56.234",
    status: "success",
    createdAt: new Date(Date.now() - 240 * 60000).toISOString(),
  },
  {
    id: "11",
    userId: "system",
    userName: "System",
    userRole: "system",
    action: "cards_generated",
    category: "card",
    details: "Generated 1,000 scratch cards for Order #ORD-2024-0089",
    ipAddress: "127.0.0.1",
    status: "success",
    createdAt: new Date(Date.now() - 300 * 60000).toISOString(),
  },
  {
    id: "12",
    userId: "admin-1",
    userName: "Super Admin",
    userRole: "admin",
    action: "fraud_resolved",
    category: "fraud",
    details: "Marked fraud case #FRD-045 as resolved",
    ipAddress: "105.112.45.123",
    status: "success",
    createdAt: new Date(Date.now() - 360 * 60000).toISOString(),
  },
];

// Skeleton Loading Component
function ActivityLogSkeleton() {
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

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ActivityLogPage() {
  const [isLoading] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalActions = mockActivityLogs.length;
    const successActions = mockActivityLogs.filter(
      (l) => l.status === "success"
    ).length;
    const failedActions = mockActivityLogs.filter(
      (l) => l.status === "failed"
    ).length;
    const warningActions = mockActivityLogs.filter(
      (l) => l.status === "warning"
    ).length;

    // Recent activity (last hour)
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentActions = mockActivityLogs.filter(
      (l) => new Date(l.createdAt).getTime() > oneHourAgo
    ).length;

    return {
      totalActions,
      successActions,
      failedActions,
      warningActions,
      recentActions,
    };
  }, []);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return mockActivityLogs.filter((log) => {
      const matchesSearch =
        searchQuery === "" ||
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || log.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" || log.status === statusFilter;

      const matchesRole = roleFilter === "all" || log.userRole === roleFilter;

      return matchesSearch && matchesCategory && matchesStatus && matchesRole;
    });
  }, [searchQuery, categoryFilter, statusFilter, roleFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "auth":
        return <LogIn className="h-4 w-4" />;
      case "redemption":
        return <Gift className="h-4 w-4" />;
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "campaign":
        return <Activity className="h-4 w-4" />;
      case "user":
        return <User className="h-4 w-4" />;
      case "system":
        return <Settings className="h-4 w-4" />;
      case "fraud":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      auth: "bg-blue-100 text-blue-700 border-blue-200",
      redemption: "bg-green-100 text-green-700 border-green-200",
      card: "bg-purple-100 text-purple-700 border-purple-200",
      campaign: "bg-orange-100 text-orange-700 border-orange-200",
      user: "bg-cyan-100 text-cyan-700 border-cyan-200",
      system: "bg-gray-100 text-gray-700 border-gray-200",
      fraud: "bg-red-100 text-red-700 border-red-200",
    };

    return (
      <Badge variant="outline" className={colors[category] || ""}>
        {getCategoryIcon(category)}
        <span className="ml-1 capitalize">{category}</span>
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="mr-1 h-3 w-3" />
            Success
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Warning
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-purple-600",
      politician: "bg-blue-600",
      citizen: "bg-green-600",
      system: "bg-gray-600",
    };

    return (
      <Badge className={colors[role] || "bg-gray-600"}>
        {role === "admin" && <Shield className="mr-1 h-3 w-3" />}
        {role === "system" && <Settings className="mr-1 h-3 w-3" />}
        <span className="capitalize">{role}</span>
      </Badge>
    );
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Activity Log</h1>
          <p className="mt-2 text-muted-foreground">
            Monitor all platform activities
          </p>
        </div>
        <ActivityLogSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity Log</h1>
          <p className="mt-2 text-muted-foreground">
            Monitor all platform activities and audit trail
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.totalActions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {kpis.recentActions} in the last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {kpis.successActions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {kpis.totalActions > 0
                ? Math.round((kpis.successActions / kpis.totalActions) * 100)
                : 0}
              % success rate
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
              {kpis.failedActions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {kpis.warningActions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Security alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => {
            setCategoryFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="auth">Authentication</SelectItem>
            <SelectItem value="redemption">Redemption</SelectItem>
            <SelectItem value="card">Cards</SelectItem>
            <SelectItem value="campaign">Campaigns</SelectItem>
            <SelectItem value="user">Users</SelectItem>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="fraud">Fraud</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={roleFilter}
          onValueChange={(value) => {
            setRoleFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="politician">Politician</SelectItem>
            <SelectItem value="citizen">Citizen</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Activity Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedLogs.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {log.userRole === "system" ? (
                                <Settings className="h-4 w-4" />
                              ) : (
                                log.userName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {log.userName}
                            </p>
                            {getRoleBadge(log.userRole)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {log.action}
                        </code>
                      </TableCell>
                      <TableCell>{getCategoryBadge(log.category)}</TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="text-sm truncate" title={log.details}>
                          {log.details}
                        </p>
                      </TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>
                        <code className="text-xs text-muted-foreground">
                          {log.ipAddress}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(log.createdAt)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredLogs.length)}{" "}
                    of {filteredLogs.length} activities
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
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
              <h3 className="mt-4 text-lg font-semibold">
                No Activities Found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery ||
                categoryFilter !== "all" ||
                statusFilter !== "all" ||
                roleFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No activities have been recorded yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Live Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockActivityLogs.slice(0, 5).map((log, index) => (
              <div key={log.id} className="flex gap-4">
                <div className="relative">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      log.status === "success"
                        ? "bg-green-100"
                        : log.status === "failed"
                        ? "bg-red-100"
                        : "bg-yellow-100"
                    }`}
                  >
                    {getCategoryIcon(log.category)}
                  </div>
                  {index < 4 && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-full bg-border" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{log.userName}</span>
                    {getRoleBadge(log.userRole)}
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(log.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{log.details}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(log.status)}
                    {getCategoryBadge(log.category)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
