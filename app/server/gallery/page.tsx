import { ServerGalleryCard } from "@/components/server/ServerGalleryCard";
import { galleryCategoryLabels, serverGallery } from "@/lib/data/server-gallery";

export const metadata = {
  title: "服务器相册"
};

export default function ServerGalleryPage() {
  const categories = ["全部", ...Object.values(galleryCategoryLabels)];

  return (
    <main className="px-4 pb-24 pt-32">
      <section className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold tracking-[0.2em] text-dream-blue/82">GALLERY</p>
        <h1 className="mt-5 text-5xl font-black tracking-[-0.02em] md:text-7xl">服务器图片与风景相册</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-sky-900/68">
          整理玩家合照、活动现场、主城建筑、自然风景、未来地图和生存发展截图。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <span key={category} className="rounded-full border border-sky-200 bg-white/72 px-4 py-2 text-sm text-sky-900/72">
              {category}
            </span>
          ))}
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {serverGallery.map((item) => (
            <ServerGalleryCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
