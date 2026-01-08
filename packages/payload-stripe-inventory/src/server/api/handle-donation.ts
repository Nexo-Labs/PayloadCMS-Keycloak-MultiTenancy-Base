import { NextResponse } from "next/server.js";
import Stripe from "stripe";
import { upsertCustomerInventoryAndSyncWithUser } from "../utils/payload/upsert-customer-inventory-and-sync-with-user.js";
import { getCustomerFromStripeOrCreate } from "../utils/stripe/get-customer-from-stripe-or-create.js";
import { stripeBuilder } from "../utils/stripe/stripe-builder.js";
import { getCurrentUserQuery } from "../access/get-current-user-query.js";
import { Payload } from "payload";

export async function handleDonation(
  request: Request,
  getPayload: () => Promise<Payload>,
  getRoutes: () => { nextJS: { subscriptionPageHref: string } }
) {
  const payload = await getPayload();
  const payloadUser = await getCurrentUserQuery(payload);
  if (!payloadUser || !payloadUser.email)
    throw new Error("You must be logged in to make a donation");

  const url = new URL(request.url);
  const amountParam = url.searchParams.get("amount");

  if (!amountParam) throw new Error("Amount is required");

  const amount = parseInt(amountParam);
  if (amount < 100) throw new Error("Minimum donation amount is €1");

  const stripe = stripeBuilder();
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
    type: "donation",
  };
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Donación - Portal Escohotado",
            description:
              "Apoyo al mantenimiento del legado digital de Antonio Escohotado",
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.DOMAIN}${getRoutes().nextJS.subscriptionPageHref}?success=donation`,
    cancel_url: `${process.env.DOMAIN}${getRoutes().nextJS.subscriptionPageHref}?error=donation_cancelled`,
    metadata,
    payment_intent_data: { metadata },
    invoice_creation: { enabled: true, invoice_data: { metadata } },
  });

  return NextResponse.json({ url: session.url });
}
