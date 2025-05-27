import { NextResponse } from "next/server";

export function errorMsgRetrn(error: unknown) {
  // Log unexpected errors for debugging
  const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred";
  return NextResponse.json(
    { error: errorMessage, code: "SERVER_ERROR" },
    { status: 500 }
  );
}
