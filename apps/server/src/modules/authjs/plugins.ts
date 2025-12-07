import payloadConfig from "@payload-config";
import NextAuth from "next-auth";
import { withPayload } from "payload-authjs";
import { authConfig } from "./authjs-config";

const nextAuthResult = NextAuth(
  withPayload(authConfig, {
    payloadConfig,
    updateUserOnSignIn: true,
  })
);

export const handlers = nextAuthResult.handlers;
export const signIn = nextAuthResult.signIn;
export const signOut = nextAuthResult.signOut;
export const auth = nextAuthResult.auth;
