import { COLLECTION_SLUG_CUSTOMERS } from "../../../model/index.js";
import { Payload } from "payload";

export async function syncCustomerByEmail({ email, payload }: { email: string, payload: Payload }) {
  const customers = await payload.find({
    collection: COLLECTION_SLUG_CUSTOMERS,
    where: { email: { equals: email } },
  });
  const customerId = customers.docs?.[0]?.id;

  await payload.update({
    collection: "users",
    data: {
      customer: customerId,
    },
    where: { email: { equals: email } },
  });
}
