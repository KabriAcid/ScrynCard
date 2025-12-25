import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function RedemptionDetailsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-4 w-96" />
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Personal Info Section */}
        <div>
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start">
                <Skeleton className="h-5 w-5 mr-4 mt-1 rounded-full" />
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Bank Details Section */}
        <div>
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start">
                <Skeleton className="h-5 w-5 mr-4 mt-1 rounded-full" />
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Location Section */}
        <div>
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start">
                <Skeleton className="h-5 w-5 mr-4 mt-1 rounded-full" />
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
