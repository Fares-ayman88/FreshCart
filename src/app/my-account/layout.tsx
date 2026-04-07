import type { Metadata } from "next";

import { MyAccountShell } from "@/components/account/my-account-shell";

export const metadata: Metadata = {
  title: "My Account | FreshCart",
};

export default function MyAccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MyAccountShell>{children}</MyAccountShell>;
}
