import Image from "next/image";
import { notFound } from "next/navigation";
import { Eye, UserCircle } from "@phosphor-icons/react/dist/ssr";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { getProfilePosts, getUserByIdOrUsername } from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = await getUserByIdOrUsername(userId);
  return {
    title: user ? `${user.displayName}的公开空间` : "公开空间"
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = await getUserByIdOrUsername(userId);
  if (!user) notFound();

  const posts = await getProfilePosts(user.id, false);

  return (
    <main className="px-4 pb-24 pt-32">
      <section className="mx-auto grid max-w-5xl gap-6">
        <GlassPanel className="overflow-hidden">
          <div className="relative h-56">
            <Image src="/images/server/group-main-gate.jpg" alt="公开空间封面" fill priority className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07101f]/88 to-transparent" />
          </div>
          <div className="p-7">
            <div className="-mt-16 grid size-24 place-items-center rounded-[28px] border border-white/16 bg-white text-[#07101f]">
              <UserCircle size={52} weight="fill" />
            </div>
            <h1 className="mt-5 text-4xl font-black">{user.displayName}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-sky-900/66">{user.bio}</p>
          </div>
        </GlassPanel>

        {posts.length ? (
          posts.map((post) => (
            <GlassPanel key={post.id} className="p-6">
              <div className="flex items-center gap-2 text-sm text-sky-900/54">
                <Eye size={16} />
                公开动态
                <span>{post.createdAt}</span>
              </div>
              <p className="mt-4 text-base leading-8 text-sky-900/72">{post.content}</p>
              {post.imageUrl ? (
                <div className="relative mt-5 aspect-video overflow-hidden rounded-[22px]">
                  <Image src={post.imageUrl} alt="公开动态配图" fill sizes="(max-width: 1024px) 100vw, 56vw" className="object-cover" />
                </div>
              ) : null}
            </GlassPanel>
          ))
        ) : (
          <GlassPanel className="p-7 text-sky-900/64">这个空间暂时没有公开动态。</GlassPanel>
        )}
      </section>
    </main>
  );
}
