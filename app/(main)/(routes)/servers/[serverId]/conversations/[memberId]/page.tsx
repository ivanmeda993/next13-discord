import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getOrCreateConversation } from "@/lib/conversation";
import { ChatHeader } from "@/components/chat/chat-header";

interface IMemberIdPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
}
const MemberIdPage = async ({ params }: IMemberIdPageProps) => {
  const profile = await currentProfile();
  const { memberId, serverId } = params;

  if (!profile) {
    return redirectToSignIn();
  }

  const loggedUser = await db.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: params.serverId,
    },
    include: {
      profile: true,
    },
  });

  if (!loggedUser) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    loggedUser.id,
    params.memberId,
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === loggedUser.id ? memberOne : memberTwo;

  return (
    <div className="bg-white dark:bg-[#313338] h-full flex flex-col">
      <ChatHeader
        serverId={serverId}
        name={otherMember.profile.name}
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
      />
    </div>
  );
};

export default MemberIdPage;
