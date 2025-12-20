import { useState } from "react";
import {
  Search,
  LayoutDashboard,
  Gift,
  BarChart3,
  ShieldCheck,
  CreditCard,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InstantLink } from "@/components/instant-link";
import { cn } from "@/lib/utils";

type SearchResult = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: any;
  category: string;
};

const searchData: SearchResult[] = [
  {
    id: "1",
    title: "Dashboard",
    description: "View overview and statistics",
    href: "/dashboard",
    icon: LayoutDashboard,
    category: "Pages",
  },
  {
    id: "2",
    title: "Redemptions",
    description: "Manage card redemptions",
    href: "/dashboard/redemptions",
    icon: Gift,
    category: "Pages",
  },
  {
    id: "3",
    title: "Analysis",
    description: "View detailed analytics",
    href: "/dashboard/analysis",
    icon: BarChart3,
    category: "Pages",
  },
  {
    id: "4",
    title: "Fraud Detection",
    description: "Monitor suspicious activities",
    href: "/dashboard/fraud-detection",
    icon: ShieldCheck,
    category: "Pages",
  },
  {
    id: "5",
    title: "Create Order",
    description: "Generate new scratch cards",
    href: "/dashboard",
    icon: CreditCard,
    category: "Actions",
  },
  {
    id: "6",
    title: "View Citizens",
    description: "See registered citizens",
    href: "/dashboard/redemptions",
    icon: Users,
    category: "Actions",
  },
];

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredResults = searchData.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
  );

  const groupedResults = filteredResults.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <>
      <Button
        variant="outline"
        className="w-full max-w-md justify-start text-muted-foreground hidden md:flex"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search pages, actions, citizens..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto p-4">
            {query === "" ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Type to search for pages, actions, and more
                </p>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  No results found for "{query}"
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedResults).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {category}
                    </h3>
                    <div className="space-y-1">
                      {items.map((item) => (
                        <InstantLink
                          key={item.id}
                          href={item.href}
                          onClick={() => {
                            setOpen(false);
                            setQuery("");
                          }}
                          className={cn(
                            "flex items-center gap-3 rounded-lg p-3 hover:bg-accent transition-colors cursor-pointer group"
                          )}
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <item.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-none mb-1">
                              {item.title}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                        </InstantLink>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
