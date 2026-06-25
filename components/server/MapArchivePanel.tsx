import { Compass, MapPin, ShieldCheck, Strategy } from "@phosphor-icons/react/dist/ssr";
import { GlassPanel } from "@/components/layout/GlassPanel";

const archive = [
  { icon: Compass, label: "地图类型", value: "未来遗构 / 探索" },
  { icon: ShieldCheck, label: "探索难度", value: "中等，建议组队" },
  { icon: Strategy, label: "推荐玩法", value: "解谜、截图、路线收集" },
  { icon: MapPin, label: "坐标档案", value: "星环平台入口已记录" }
];

export function MapArchivePanel() {
  return (
    <GlassPanel className="p-5">
      <p className="text-lg font-bold">地图档案</p>
      <div className="mt-5 grid gap-3">
        {archive.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <div className="flex items-center gap-2 text-sm text-dream-blue">
                <Icon size={18} />
                {item.label}
              </div>
              <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}
