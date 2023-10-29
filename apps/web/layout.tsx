import * as React from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import type { Metadata } from "next";
import TrpcProvider from "@/trpc/Provider";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { serverClient } from "@/trpc/serverClient";

export const metadata: Metadata = {
  title: "AuditLab",
  description: "AuditLab Compliance Dashboard",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

async function RootLayoutBody({ children }: RootLayoutProps) {
  const headersList = headers();
  const pathname = headersList.get("x-invoke-path") || "";

  // check user exists
  const data = await serverClient.users.exists();

  // todo: handle non 2** status codes
  if (data.Status == 204) {
    if (pathname != "/register") {
      redirect("/register");
    }
  } else if (pathname == "/register") {
    redirect("/");
  }

  return <>{children}</>;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <TrpcProvider>
        <UserProvider>
          <body>
            <RootLayoutBody>{children}</RootLayoutBody>
          </body>
        </UserProvider>
      </TrpcProvider>
    </html>
  );
}
