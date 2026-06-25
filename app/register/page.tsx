import { RegisterPanel } from "@/components/auth/RegisterPanel";

export const metadata = {
  title: "注册"
};

export default function RegisterPage() {
  return (
    <main className="px-4 pb-24 pt-32">
      <RegisterPanel />
    </main>
  );
}
