import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { biodatas } from "@/lib/db/schema";
import { biodataSchema, defaultBiodataValues } from "@/lib/schema";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  return NextResponse.json({ biodatas: rows });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Optional initial payload — used when migrating an anonymous draft into
  // an account on sign-in. Falls back to a blank biodata otherwise.
  let initialData = defaultBiodataValues;
  const body = await req.json().catch(() => null);
  if (body?.data !== undefined) {
    const parsed = biodataSchema.safeParse(body.data);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid biodata payload" }, { status: 400 });
    }
    initialData = parsed.data;
  }

  const title = initialData.personal.fullName?.trim() || "Untitled biodata";

  const [row] = await db
    .insert(biodatas)
    .values({
      userId: session.user.id,
      title,
      data: initialData,
    })
    .returning({ id: biodatas.id });

  return NextResponse.json({ id: row.id });
}
