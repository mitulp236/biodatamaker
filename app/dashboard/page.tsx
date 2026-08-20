import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { biodatas } from "@/lib/db/schema";
import { AppHeader } from "@/components/layout/AppHeader";
import { DashboardList } from "@/components/dashboard/DashboardList";
import { DraftMigrationGate } from "@/components/dashboard/DraftMigrationGate";
import { BiodataFormValues } from "@/lib/schema";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const rows = await db
    .select({
      id: biodatas.id,
      title: biodatas.title,
      data: biodatas.data,
      updatedAt: biodatas.updatedAt,
    })
    .from(biodatas)
    .where(eq(biodatas.userId, session.user.id))
    .orderBy(desc(biodatas.updatedAt));

  const initial = rows.map((r) => ({
    id: r.id,
    title: r.title,
    data: r.data as BiodataFormValues,
    updatedAt: r.updatedAt.toISOString(),
  }));

  return (
    <>
      <AppHeader />
      <DraftMigrationGate>
        <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-stone-900">My Biodatas</h1>
          </div>
          <p className="mt-1 text-sm text-stone-500">
            Saved to your account — {session.user.email}
          </p>

          <DashboardList initial={initial} />
        </main>
      </DraftMigrationGate>
    </>
  );
}
