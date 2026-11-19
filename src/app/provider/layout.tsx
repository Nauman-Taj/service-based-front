import type { ReactNode } from "react";

export default function ProviderLayout({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 flex-col">{children}</div>;
}
