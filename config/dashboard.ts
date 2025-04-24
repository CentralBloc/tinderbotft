import {routes} from "@/lib/routes";
import {MainNavItem} from "@/types";
import {
  CreditCard,
  GitBranch,
  Instagram,
  LayoutGrid,
  Network,
  NotebookTabs,
  Package,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

export const dashboardConfig = (user: { super_user: boolean }) => ({
  mainNav: [
    {
      title: "Dashboard",
      href: routes.dashboard.home,
      icon: LayoutGrid,
    },
    {
      title: "Account",
      href: routes.dashboard.account.index,
      icon: NotebookTabs,
    },
    {
      title: "Models",
      href: routes.dashboard.model.index,
      icon: UserRound,
    },
    {
      title: "Strategy",
      icon: GitBranch,
      href: routes.dashboard.strategy.index,
    },
    {
      title: "Proxies",
      icon: Network,
      href: routes.dashboard.proxy.index,
    },
    ...(user.super_user
      ? [
        {
          title: "Insta",
          href: routes.dashboard.insta.index,
          icon: Instagram,
        },
        {
          title: "Admin",
          href: routes.dashboard.admin.index,
          icon: Settings,
          items: [
            {
              title: "Users",
              href: routes.dashboard.admin.index,
              icon: Users,
            },
            {
              title: "Plans",
              href: routes.dashboard.admin.plans.index,
              icon: Package,
            },
            {
              title: "Subscriptions",
              href: routes.dashboard.admin.subscriptions.index,
              icon: CreditCard,
            },
          ],
        },
      ]
      : []),
  ] satisfies MainNavItem[],
});