import { stripePlugin } from "@payloadcms/plugin-stripe";
import {
  priceDeleted,
  subscriptionUpsert,
  subscriptionDeleted,
  productDeleted,
  paymentSucceeded,
  invoiceSucceeded,
  customerDeleted,
} from "./actions/index.js";
import { Plugin } from "payload";

export const plugin = (
  onSubscriptionUpdate: (
    type: "create" | "delete",
    userId: string
  ) => Promise<void>
): Plugin => {
  return stripePlugin({
    isTestKey: process.env.STRIPE_SECRET_KEY?.includes("sk_test"),
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
    stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOK_SECRET,
    webhooks: {
      "price.deleted": async ({ event, payload }) =>
        await priceDeleted(event.data.object, payload),
      "customer.subscription.created": async ({ event, payload }) =>
        await subscriptionUpsert(
          event.data.object,
          payload,
          onSubscriptionUpdate
        ),
      "customer.subscription.paused": async ({ event, payload }) =>
        await subscriptionUpsert(
          event.data.object,
          payload,
          onSubscriptionUpdate
        ),
      "customer.subscription.updated": async ({ event, payload }) =>
        await subscriptionUpsert(
          event.data.object,
          payload,
          onSubscriptionUpdate
        ),
      "customer.subscription.deleted": async ({ event, payload }) =>
        await subscriptionDeleted(
          event.data.object,
          payload,
          onSubscriptionUpdate
        ),
      "customer.deleted": async ({ event, payload }) =>
        await customerDeleted(event.data.object, payload),
      "product.deleted": async ({ event, payload }) =>
        await productDeleted(event.data.object, payload),
      "payment_intent.succeeded": async ({ event, payload }) => {
        await paymentSucceeded(event.data.object, payload)
      },
      "invoice.paid": async ({ event, payload }) => {
        await invoiceSucceeded(event.data.object, payload)
      }
    },
  });
};
