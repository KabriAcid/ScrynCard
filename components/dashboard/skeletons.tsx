import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";

function StatCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-4 rounded-sm" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="mt-1 h-3 w-1/3" />
            </CardContent>
        </Card>
    );
}

function ChartSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[350px] w-full" />
            </CardContent>
        </Card>
    );
}

export function DashboardSkeleton() {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
                <ChartSkeleton />
                <ChartSkeleton />
            </div>
        </>
    )
}

export function TableSkeleton({ numRows = 5, numCells = 5 }: { numRows?: number, numCells?: number }) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: numCells }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-5 w-full" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: numRows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: numCells }).map((_, cellIndex) => (
                <TableCell key={cellIndex}>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
