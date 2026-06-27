import { Gauge, GameController, Heartbeat, Sparkle, UsersThree } from "@phosphor-icons/react/dist/ssr";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { serverStatus } from "@/lib/data/site";

const rows = [
  { icon: Heartbeat, label: "状态", value: serverStatus.state },
  { icon: Gauge, label: "延迟", value: serverStatus.latency },
  { icon: GameController, label: "版本", value: serverStatus.version },
  { icon: UsersThree, label: "玩家", value: serverStatus.players },
  { icon: Sparkle, label: "活动", value: serverStatus.event }
];

export function ServerStatusPanel() {
  return (
    <GlassPanel className="p-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold">服务器状态</p>
        <span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-bold text-[#07101f]">
          在线中
        </span>
      </div>
      <div className="mt-5 grid gap-3">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label} className="flex items-center justify-between rounded-2xl border border-sky-200/55 bg-white/64 p-3">
              <span className="flex items-center gap-3 text-sm text-sky-900/62">
                <Icon size={18} />
                {row.label}
              </span>
              <span className="text-sm font-semibold text-sky-950">{row.value}</span>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}
