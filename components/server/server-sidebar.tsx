import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ChannelType, MemberRole } from "@prisma/client";
import { ServerHeader } from "@/components/server/server-header";

interface IServerSidebar {
  serverId: string;
}
export default async function ServerSidebar({ serverId }: IServerSidebar) {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const filterChannels = (channelType: ChannelType) => {
    return server?.channels.filter((channel) => channel.type === channelType);
  };

  const textChannels = filterChannels(ChannelType.TEXT);
  const audioChannels = filterChannels(ChannelType.AUDIO);
  const videoChannels = filterChannels(ChannelType.VIDEO);

  const members = server?.members.filter(
    (member) => member.profileId !== profile.id,
  );

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find((member) => member.profileId === profile.id)
    ?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
    </div>
  );
}
