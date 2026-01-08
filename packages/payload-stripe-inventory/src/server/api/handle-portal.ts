import { NextResponse } from "next/server.js";
import Stripe from "stripe";
import { upsertCustomerInventoryAndSyncWithUser } from "../utils/payload/upsert-customer-inventory-and-sync-with-user.js";
import { getCustomerFromStripeOrCreate } from "../utils/stripe/get-customer-from-stripe-or-create.js";
import { stripeBuilder } from "../utils/stripe/stripe-builder.js";
import { getCurrentUserQuery } from "../access/get-current-user-query.js";
import { Payload } from "payload";

export async function handlePortal(
  request: Request,
  getPayload: () => Promise<Payload>,
  getRoutes: () => { nextJS: { subscriptionPageHref: string } }
) {
  const payload = await getPayload();
  const payloadUser = await getCurrentUserQuery(payload);
  if (!payloadUser || !payloadUser.email)
    throw new Error("You must be logged in to access this page");
  const url = new URL(request.url);
  const cancelSubscriptionId = url.searchParams.get("cancelSubscriptionId");
  const updateSubscriptionId = url.searchParams.get("updateSubscriptionId");

  let flowData: Stripe.BillingPortal.SessionCreateParams.FlowData | undefined;
  if (cancelSubscriptionId)
    flowData = {
      type: "subscription_cancel",
      subscription_cancel: { subscription: cancelSubscriptionId },
    };
  else if (updateSubscriptionId)
    flowData = {
      type: "subscription_update",
      subscription_update: { subscription: updateSubscriptionId },
    };

  const stripe = stripeBuilder();
  const routes = getRoutes();
  const customerId = await getCustomerFromStripeOrCreate(
    payloadUser.email,
    payloadUser.name
  );
  await upsertCustomerInventoryAndSyncWithUser(
    payload,
    payloadUser.customer?.inventory,
    payloadUser.email,
    customerId
  );

  const session = await stripe.billingPortal.sessions.create({
    flow_data: flowData,
    customer: customerId,
    return_url: `${process.env.DOMAIN}${routes.nextJS.subscriptionPageHref}`,
  });

  return NextResponse.redirect(session.url, 303);
}
