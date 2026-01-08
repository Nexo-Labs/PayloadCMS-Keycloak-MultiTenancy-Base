import Stripe from "stripe";
import { stripeBuilder } from "./stripe-builder.js";

export async function getCustomer({
  stripe,
  email,
}: {
  stripe?: Stripe;
  email: string;
}): Promise<Stripe.Customer | null> {
  stripe = stripe ?? stripeBuilder();
  const customers =  await stripe.customers.search({
    query: `email:'${email}'`,
  });
  return customers.data.length ? customers.data[0] as Stripe.Customer : null;
  
}

export async function resolveStripeCustomer({ customer }: {
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null
}): Promise<Stripe.Customer | Stripe.DeletedCustomer | null> {
  const stripe = stripeBuilder();
  if (typeof customer === "string") {
    return await stripe.customers.retrieve(customer);
  }
  return customer;
}