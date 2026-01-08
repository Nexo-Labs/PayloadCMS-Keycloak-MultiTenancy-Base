import { NextResponse } from "next/server.js";
import { handleDonation } from "./handle-donation.js";
import { handleUpdate } from "./handle-update.js";
import { handlePortal } from "./handle-portal.js";
import { handleCheckout } from "./handle-checkout.js";
import type { StripeHandlers } from "../../types/index.js";
import { Payload } from "payload";
export * from "../utils/stripe/get-customer-from-stripe-or-create.js";

export function createStripeInventoryHandlers(
  getPayload: () => Promise<Payload>,
  getRoutes: () => { nextJS: { subscriptionPageHref: string } }
): StripeHandlers {
  return {
    checkout: {
      GET: (request: Request) =>
        handleCheckout(request, getPayload, getRoutes),
    },
    portal: {
      GET: (request: Request) =>
        handlePortal(request, getPayload, getRoutes),
    },
    update: {
      GET: (request: Request) =>
        handleUpdate(request, getPayload, getRoutes),
    },
    donation: {
      GET: (request: Request) =>
        handleDonation(request, getPayload, getRoutes),
    },
  };
}

export function createRouteHandlers(
  getPayload: () => Promise<Payload>,
  getRoutes: () => { nextJS: { subscriptionPageHref: string } }
) {
  return {
    GET: async (
      request: Request,
      { params }: { params: Promise<{ stripe: string[] }> }
    ) => {
      const path = (await params).stripe[0];
      const handlers = createStripeInventoryHandlers(getPayload, getRoutes);

      if (
        path === "checkout" ||
        path === "portal" ||
        path === "update" ||
        path === "donation"
      ) {
        return handlers[path].GET(request);
      }

      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    },
  };
}
