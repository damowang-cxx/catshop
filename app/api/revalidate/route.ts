import { revalidate } from "lib/commerce";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<Response> {
  const result = await revalidate(req);

  if (result instanceof Response) {
    return result;
  }

  return NextResponse.json(result ?? { status: 200 });
}
