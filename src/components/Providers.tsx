'use client';

import { SocketProvider } from "@/contexts/socket";


export function Providers({ children }: { children: React.ReactNode }) {
  return <SocketProvider>{children}</SocketProvider>;
}
