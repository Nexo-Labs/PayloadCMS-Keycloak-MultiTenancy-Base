import { NextResponse } from "next/server.js";

export interface RouteHandlers {
  GET: (request: Request) => Promise<NextResponse>;
}

export interface StripeHandlers {
  checkout: RouteHandlers;
  portal: RouteHandlers;
  update: RouteHandlers;
  donation: RouteHandlers;
}