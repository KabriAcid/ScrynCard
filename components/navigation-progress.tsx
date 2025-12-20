"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsNavigating(false);
    setProgress(0);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!isNavigating) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isNavigating]);

  // Listen for navigation start (you can trigger this from your InstantLink)
  useEffect(() => {
    const handleStart = () => {
      setIsNavigating(true);
      setProgress(20);
    };

    window.addEventListener("navigationStart", handleStart);
    return () => window.removeEventListener("navigationStart", handleStart);
  }, []);

  if (!isNavigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Progress value={progress} className="h-1 rounded-none" />
    </div>
  );
}
