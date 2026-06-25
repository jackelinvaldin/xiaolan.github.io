import { ProfileSpace } from "@/components/profile/ProfileSpace";
import { profilePosts } from "@/lib/data/community";

export const metadata = {
  title: "我的个人空间"
};

export default function ProfilePage() {
  return (
    <main className="px-4 pb-24 pt-32">
      <section className="mx-auto max-w-7xl">
        <ProfileSpace initialPosts={profilePosts} />
      </section>
    </main>
  );
}
