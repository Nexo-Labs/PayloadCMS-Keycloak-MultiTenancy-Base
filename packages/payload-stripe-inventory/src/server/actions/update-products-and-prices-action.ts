"use server";

import { updatePrices } from "./price.js";
import { updateProducts } from "./product.js";
import { Payload } from "payload";

export async function updateProductsAndPrices(payload: Payload) {
  await updateProducts(payload);
  await updatePrices(payload);
}
