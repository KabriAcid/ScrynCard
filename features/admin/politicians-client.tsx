import { useState } from "react";
import { Search, Plus, Users } from "lucide-react";
import { DataTable, EmptyState } from "@/components/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/use-debounce";

interface Politician {
  id: string;
  name: string;
  party: string;
  status: string;
  createdAt: Date;
  cardsIssued: number;
  redemptions: number;
  alerts: number;
}

interface PoliticiansClientProps {
  politicians: Politician[];
}

export function PoliticiansClient({ politicians }: PoliticiansClientProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredData = politicians.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.party.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusVariant = (status: string) => {
    if (status === "ACTIVE") return "default";
    if (status === "SUSPENDED") return "destructive";
    return "secondary";
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "party", label: "Party" },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge variant={getStatusVariant(value)} className="capitalize">
          {value.toLowerCase()}
        </Badge>
      ),
    },
    { key: "cardsIssued", label: "Cards Issued" },
    { key: "redemptions", label: "Redemptions" },
    {
      key: "alerts",
      label: "Alerts",
      render: (value: number) =>
        value > 0 ? (
          <Badge variant="destructive">{value}</Badge>
        ) : (
          <span className="text-muted-foreground">0</span>
        ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Politicians Management</h1>
          <p className="mt-2 text-muted-foreground">
            Manage all politicians on the platform
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Onboard Politician
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or party..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {filteredData.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No politicians found"
          description="Try adjusting your search or filter criteria"
          action={{ label: "Onboard Politician", onClick: () => {} }}
        />
      ) : (
        <DataTable
          title="Politicians"
          description={`Showing ${filteredData.length} politician${
            filteredData.length !== 1 ? "s" : ""
          }`}
          columns={columns}
          data={filteredData}
        />
      )}
    </div>
  );
}
