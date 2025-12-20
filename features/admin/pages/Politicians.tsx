"use client";

import { useEffect } from "react";
import { DashboardSkeleton } from "@/components/dashboard/skeletons";
import { useAdminStore } from "@/stores/adminStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function PoliticiansPage() {
  const { politicians, isLoading, fetchPoliticians } = useAdminStore();

  useEffect(() => {
    fetchPoliticians();
  }, [fetchPoliticians]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8" />
          Politicians
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage all registered politicians on the platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Politicians ({politicians.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Party</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {politicians.map((politician) => (
                <TableRow key={politician.id}>
                  <TableCell className="font-medium">{politician.fullName}</TableCell>
                  <TableCell>{politician.party}</TableCell>
                  <TableCell>{politician.position}</TableCell>
                  <TableCell>{politician.state}</TableCell>
                  <TableCell>
                    <Badge variant={politician.verified ? "default" : "secondary"}>
                      {politician.verified ? "Verified" : "Pending"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
      <PoliticiansContent />
    </Suspense>
  );
}
