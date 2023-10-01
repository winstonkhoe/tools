import { createContext, useState, useContext, ReactNode } from 'react';
import { Socket, io } from 'socket.io-client';

type ISocketContext = [Socket, React.Dispatch<React.SetStateAction<Socket>>];

const defaultSocket = io(`${process.env.NEXT_PUBLIC_TOOLS_BACKEND_HOST}`);

const socketContextDefaultValues: ISocketContext = [
  defaultSocket,
  () => defaultSocket
];

export const SocketContext = createContext<ISocketContext>(
  socketContextDefaultValues
);

type Props = {
  children: ReactNode;
};

export function SocketProvider({ children }: Props) {
  const [socket, setSocket] = useState<Socket>(defaultSocket);
  return (
    <SocketContext.Provider value={[socket, setSocket]}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
