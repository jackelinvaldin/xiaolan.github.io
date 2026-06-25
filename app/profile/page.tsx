import { ProfileSpace } from "@/components/profile/ProfileSpace";

export const metadata = {
  title: "我的个人空间"
};

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  return (
    <main className="px-4 pb-24 pt-32">
      <section className="mx-auto max-w-7xl">
        <ProfileSpace initialPosts={[]} />
      </section>
    </main>
  );
}
