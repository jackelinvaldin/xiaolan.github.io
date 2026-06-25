import { CommunityFeed } from "@/components/community/CommunityFeed";
import { getCommunityPosts } from "@/lib/repository";

export const metadata = {
  title: "社区发言区"
};

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const communityPosts = await getCommunityPosts();

  return (
    <main className="px-4 pb-24 pt-32">
      <section className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold tracking-[0.2em] text-dream-blue/82">COMMUNITY</p>
        <h1 className="mt-5 text-5xl font-black tracking-[-0.02em] md:text-7xl">社区发言区</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/66">
          游客可以浏览公开留言。登录成员可以发言、点赞和回复，管理员可以管理社区内容。
        </p>
        <div className="mt-10">
          <CommunityFeed initialPosts={communityPosts} />
        </div>
      </section>
    </main>
  );
}
