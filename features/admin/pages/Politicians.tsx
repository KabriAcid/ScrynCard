import { Suspense } from "react";
import { DashboardSkeleton } from "@/components/dashboard/skeletons";
import { simulateDelay } from "@/lib/dev-utils";
import prisma from "@/lib/prisma";
import { PoliticiansClient } from "./politicians-client";

async function getPoliticiansData() {
  await simulateDelay(800);

  const politicians = await prisma.politician.findMany({
    include: {
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });

  // Get redemption counts per politician through their orders
  const politiciansWithStats = await Promise.all(
    politicians.map(async (politician) => {
      const redemptions = await prisma.redemption.count({
        where: {
          scratchCard: {
            order: {
              politicianId: politician.id,
            },
          },
        },
      });

      const cardsIssued = await prisma.scratchCard.count({
        where: {
          order: {
            politicianId: politician.id,
          },
        },
      });

      return {
        id: politician.id,
        name: politician.name,
        party: politician.party,
        status: politician.status,
        createdAt: politician.createdAt,
        cardsIssued,
        redemptions,
        alerts: politician._count.fraudAlerts,
      };
    })
  );

  return politiciansWithStats;
}

async function PoliticiansContent() {
  const politicians = await getPoliticiansData();

  return <PoliticiansClient politicians={politicians} />;
}

export default function PoliticiansPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <PoliticiansContent />
    </Suspense>
  );
}
