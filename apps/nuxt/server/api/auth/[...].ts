import { NuxtAuthHandler } from "#auth";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { sendVerificationRequest } from "../../verification-request";

import EmailProvider from "next-auth/providers/email";
import jwt from "jsonwebtoken";

import type { NextAuthOptions } from "next-auth";

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  secret: process.env.NUXT_SECRET,
  adapter: PrismaAdapter(prisma) as any,
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.token = signJWTForSocketIO(user.id);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    EmailProvider.default({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
};

const signJWTForSocketIO = (userId: string) => {
  return jwt.sign({ uid: userId }, process.env.NUXT_SECRET || "", {
    expiresIn: "1h",
  });
};

export default NuxtAuthHandler(authOptions);
