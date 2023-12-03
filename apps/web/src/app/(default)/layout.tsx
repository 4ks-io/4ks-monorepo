import * as React from "react";
interface ChildrenProps {
  children: React.ReactNode;
}

export default async function EmptyLayout({ children }: ChildrenProps) {
  return <>{children}</>;
}
