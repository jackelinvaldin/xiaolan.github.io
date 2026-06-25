import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "管理员后台"
};

export default function AdminPage() {
  return (
    <main className="px-4 pb-24 pt-32">
      <section className="mx-auto max-w-7xl">
        <AdminDashboard />
      </section>
    </main>
  );
}
