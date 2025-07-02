/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import { getAuthOptions } from "@/lib/auth";

const handler = async (...args: any[]) => {
  const options = await getAuthOptions();
  return (NextAuth as any)(options)(...args);
};

export const GET = handler;
export const POST = handler;
