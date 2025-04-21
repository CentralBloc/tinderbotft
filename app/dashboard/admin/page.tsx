import {Metadata} from "next";
import {Breadcrumbs} from "@/components/pagers/breadcrumbs";
import {Suspense} from "react";
import UsersList from "@/components/tables/super-admin/user-list";

export const metadata: Metadata = {
  title: "Dashboard - Admin",
  description: "Dashboard admin page",
};

export default function AdminPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Breadcrumbs segments={[{ title: "Admin" }]} />
      </div>

      <Suspense>
        <UsersList />
      </Suspense>
    </div>
  );
}
