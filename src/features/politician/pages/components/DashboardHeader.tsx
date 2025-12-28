interface DashboardHeaderProps {
  politicianName: string;
}

export function DashboardHeader({ politicianName }: DashboardHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome back, {politicianName}!
      </p>
    </div>
  );
}
