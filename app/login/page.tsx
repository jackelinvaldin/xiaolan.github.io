import { LoginPanel } from "@/components/auth/LoginPanel";

export const metadata = {
  title: "登录"
};

export default function LoginPage() {
  return (
    <main className="px-4 pb-24 pt-32">
      <LoginPanel />
    </main>
  );
}
