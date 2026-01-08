import { NextResponse } from "next/server.js";
import type { Customer, CustomerInventory } from "../../types/index.js";
import { upsertCustomerInventoryAndSyncWithUser } from "../utils/payload/upsert-customer-inventory-and-sync-with-user.js";
import { stripeBuilder } from "../utils/stripe/stripe-builder.js";
import { getCurrentUserQuery } from "../access/get-current-user-query.js";
import { Payload } from "payload";

export async function handleUpdate(
  request: Request,
  getPayload: () => Promise<Payload>,
  getRoutes: () => { nextJS: { subscriptionPageHref: string } }
) {
  const payload = await getPayload();
  const payloadUser = await getCurrentUserQuery(payload);
  if (!payloadUser) {
    throw new Error("You must be logged in to access this page");
  }
  const { searchParams } = new URL(request.url);
  const subscriptionId = searchParams.get("subscriptionId");
  const cancelAtPeriodEnd = searchParams.get("cancelAtPeriodEnd") === "true";
  if (!subscriptionId) throw Error("SubscriptionId could not be found.");

  await stripeBuilder().subscriptions.update(subscriptionId, {
    cancel_at_period_end: cancelAtPeriodEnd,
  });
  const customer = payloadUser.customer as Customer;
  console.error("UPDATE: customer", customer);
  const inventory = customer.inventory as CustomerInventory | null;
  if (inventory && inventory.subscriptions && inventory.subscriptions[subscriptionId]) {
    inventory.subscriptions[subscriptionId].cancel_at_period_end =
      cancelAtPeriodEnd;
  }

  await upsertCustomerInventoryAndSyncWithUser(
    payload,
    inventory,
    customer.email
  );

  const routes = getRoutes();
  return NextResponse.redirect(
    `${process.env.DOMAIN}${routes.nextJS.subscriptionPageHref}?refresh=${Date.now()}`,
    303
  );
}
