import { COLLECTION_SLUG_CUSTOMERS, generateCustomerInventory } from "../../../model/index.js";
import type { CustomerInventory } from "../../../types/index.js";
import { syncCustomerByEmail } from "./sync-customer-by-email.js";
import { payloadUpsert } from "./upsert.js";
import { Payload } from "payload";

export async function upsertCustomerInventoryAndSyncWithUser(
  payload: Payload,
  inventory: CustomerInventory | null | undefined,
  email: string,
  stripeCustomerId?: string | null
) {
  await payloadUpsert({
    payload,
    collection: COLLECTION_SLUG_CUSTOMERS,
    data: {
      email: email,
      stripeId: stripeCustomerId,
      inventory: inventory ?? generateCustomerInventory(),
    },
    where: { email: { equals: email } },
  });
  await syncCustomerByEmail({ email, payload });
}
