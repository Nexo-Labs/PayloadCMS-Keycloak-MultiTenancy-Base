import { NextResponse } from "next/server.js";
import Stripe from "stripe";
import { upsertCustomerInventoryAndSyncWithUser } from "../utils/payload/upsert-customer-inventory-and-sync-with-user.js";
import { getCustomerFromStripeOrCreate } from "../utils/stripe/get-customer-from-stripe-or-create.js";
import { stripeBuilder } from "../utils/stripe/stripe-builder.js";
import { getCurrentUserQuery } from "../access/get-current-user-query.js";
import { Payload } from "payload";

export async function handleCheckout(
  request: Request,
  getPayload: () => Promise<Payload>,
  getRoutes: () => { nextJS: { subscriptionPageHref: string } }
) {
  const payload = await getPayload();
  const payloadUser = await getCurrentUserQuery(payload);

  const url = new URL(request.url);
  const priceId = url.searchParams.get("priceId");
  if (!priceId || !payloadUser || !payloadUser.email)
    throw new Error("Invalid request");

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

  const metadata: Stripe.MetadataParam = {
    type: "subscription",
  };

  const checkoutResult = await stripe.checkout.sessions.create({
    success_url: `${process.env.DOMAIN}${routes.nextJS.subscriptionPageHref}?success=${Date.now()}`,
    cancel_url: `${process.env.DOMAIN}${routes.nextJS.subscriptionPageHref}?error=${Date.now()}`,
    mode: "subscription",
    customer: customerId,
    client_reference_id: String(payloadUser.id),
    line_items: [{ price: priceId, quantity: 1 }],
    metadata,
    tax_id_collection: { enabled: true },
    customer_update: {
      name: "auto",
      address: "auto",
      shipping: "auto",
    },
    subscription_data: { metadata },
  });
  if (checkoutResult.url) return NextResponse.redirect(checkoutResult.url, 303);
  else return NextResponse.json("Create checkout url failed", { status: 406 });
}
