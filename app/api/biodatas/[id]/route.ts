import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { biodatas } from "@/lib/db/schema";
import { biodataSchema } from "@/lib/schema";

async function loadOwned(id: string, userId: string) {
  const [row] = await db
    .select()
    .from(biodatas)
    .where(and(eq(biodatas.id, id), eq(biodatas.userId, userId)));
  return row ?? null;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const row = await loadOwned(params.id, session.user.id);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ id: row.id, title: row.title, data: row.data });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await loadOwned(params.id, session.user.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();

  // Rename-only request: { title } with no data payload.
  if (body.data === undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 });
    }
    await db
      .update(biodatas)
      .set({ title: body.title.trim(), updatedAt: new Date() })
      .where(eq(biodatas.id, params.id));
    return NextResponse.json({ ok: true });
  }

  const parsed = biodataSchema.safeParse(body.data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid biodata payload" }, { status: 400 });
  }

  const title =
    typeof body.title === "string" && body.title.trim()
      ? body.title.trim()
      : parsed.data.personal.fullName?.trim() || "Untitled biodata";

  await db
    .update(biodatas)
    .set({ data: parsed.data, title, updatedAt: new Date() })
    .where(eq(biodatas.id, params.id));

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await loadOwned(params.id, session.user.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.delete(biodatas).where(eq(biodatas.id, params.id));

  return NextResponse.json({ ok: true });
}
