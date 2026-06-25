import Image from "next/image";
import { Compass, MapPin, Path, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { ActionButton } from "@/components/ActionButton";

const mapBlocks = [
  { icon: Compass, title: "星环之境", text: "未来遗构区域，适合探索、截图和路线收集。" },
  { icon: ShieldCheck, title: "主城花园", text: "社区共建区域，适合轻量建筑和活动布置。" },
  { icon: Path, title: "雪境原野", text: "偏自然风景路线，适合巡礼和地标打卡。" },
  { icon: MapPin, title: "坐标档案", text: "MVP 先展示档案卡，后续接入收藏和详情页。" }
];

export const metadata = {
  title: "地图档案"
};

export default function ServerMapsPage() {
  return (
    <main className="px-4 pb-24 pt-32">
      <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-dream-blue/82">MAPS</p>
          <h1 className="mt-5 text-5xl font-black leading-[1.05] tracking-[-0.02em] md:text-7xl">地图档案与区域介绍</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/66">
            将服务器地图按故事、探索难度、坐标和推荐玩法整理，方便玩家进入不同区域。
          </p>
          <div className="mt-8">
            <ActionButton href="/server">返回服务器专区</ActionButton>
          </div>
        </div>
        <GlassPanel className="overflow-hidden p-3">
          <div className="relative min-h-[480px] overflow-hidden rounded-[24px]">
            <Image
              src="/images/server/storm-ring-relic.jpg"
              alt="星环之境地图档案"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07101f]/88 to-transparent" />
          </div>
        </GlassPanel>
      </section>
      <section className="mx-auto mt-16 grid max-w-7xl gap-4 md:grid-cols-2">
        {mapBlocks.map((block) => {
          const Icon = block.icon;
          return (
            <GlassPanel key={block.title} className="p-6">
              <Icon size={26} className="text-starlight-pink" />
              <h2 className="mt-4 text-2xl font-bold">{block.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/64">{block.text}</p>
            </GlassPanel>
          );
        })}
      </section>
    </main>
  );
}
