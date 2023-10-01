'use client';

import { SocketProvider } from "@/contexts/Socket";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SocketProvider>{children}</SocketProvider>;
}
