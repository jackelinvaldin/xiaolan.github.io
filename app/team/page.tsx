import Image from "next/image";
import { Crown, ShieldCheck, Sparkle, Strategy } from "@phosphor-icons/react/dist/ssr";
import { GlassPanel } from "@/components/layout/GlassPanel";
import { MotionSection } from "@/components/MotionSection";
import { teamIntro, teamMembers } from "@/lib/data/team";

const icons = [Strategy, ShieldCheck, Sparkle, Crown];

export const metadata = {
  title: "团队介绍"
};

export default function TeamPage() {
  return (
    <main className="px-4 pb-24 pt-32">
      <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-dream-blue/82">TEAM</p>
          <h1 className="mt-5 text-5xl font-black leading-[1.05] tracking-[-0.02em] md:text-7xl">
            琢光绮梦团队
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-white/68">{teamIntro}</p>
        </div>
        <GlassPanel className="overflow-hidden p-3">
          <div className="relative min-h-[460px] overflow-hidden rounded-[24px]">
            <Image
              src="/images/server/group-main-gate.jpg"
              alt="琢光绮梦团队合影"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07101f]/86 to-transparent" />
          </div>
        </GlassPanel>
      </section>

      <MotionSection className="mx-auto mt-20 max-w-7xl">
        <div className="grid gap-4 md:grid-cols-2">
          {teamMembers.map((member, index) => {
            const Icon = icons[index];
            return (
              <GlassPanel key={member.id} className="p-7">
                <div className="flex items-start gap-5">
                  <div
                    className="grid size-14 shrink-0 place-items-center rounded-[20px] text-[#07101f]"
                    style={{ background: member.accent }}
                  >
                    <Icon size={24} weight="fill" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black">{member.formalName}</h2>
                    <p className="mt-1 text-sm text-white/50">日常展示名：{member.displayName}</p>
                    <p className="mt-4 text-lg font-semibold text-dream-blue">{member.role}</p>
                    <p className="mt-3 text-sm leading-7 text-white/66">{member.description}</p>
                  </div>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      </MotionSection>
    </main>
  );
}
