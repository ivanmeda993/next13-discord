"use client";
import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";

interface ISocketIndicator {}
export const SocketIndicator = ({}: ISocketIndicator) => {
  const { socket, isConnected } = useSocket();

  if (!isConnected)
    return (
      <Badge variant="outline" className="bg-rose-400 text-white border-none">
        Offline
      </Badge>
    );

  return (
    <Badge variant="outline" className="bg-emerald-600 text-white border-none">
      Live
    </Badge>
  );
};
