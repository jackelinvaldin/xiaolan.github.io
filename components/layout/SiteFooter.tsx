import Link from "next/link";
import { DiscordLogo, GithubLogo, MapTrifold } from "@phosphor-icons/react/dist/ssr";
import { siteName, siteNameEn } from "@/lib/data/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#080d1b] px-4 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="text-2xl font-bold">{siteName}</p>
          <p className="mt-2 text-sm tracking-[0.18em] text-white/42">{siteNameEn}</p>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/62">
            蓝水警尘梦，夜吟开草堂。
          </p>
        </div>
        <div>
          <p className="font-semibold">站点</p>
          <div className="mt-4 grid gap-3 text-sm text-white/62">
            <Link href="/server">服务器专区</Link>
            <Link href="/server/gallery">风景相册</Link>
            <Link href="/community">社区发言区</Link>
            <Link href="/announcements">公告列表</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">连接</p>
          <div className="mt-4 flex gap-3">
            {[DiscordLogo, GithubLogo, MapTrifold].map((Icon, index) => (
              <span
                key={index}
                className="grid size-11 place-items-center rounded-full border border-white/12 bg-white/7 text-white/70"
              >
                <Icon size={20} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
