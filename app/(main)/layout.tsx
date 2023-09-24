import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { initialProfile } from "@/lib/initial-profile";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  //   TODO fix this, use WebHook to handle user changes on Clerk
  const profile = await initialProfile();

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </div>
  );
};

export default MainLayout;
