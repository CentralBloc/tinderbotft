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

// Function to generate the dashboard configuration based on user info
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
    // Conditionally include the Admin panel
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
                href: "/dashboard/plans",
                icon: Package,
              },
              {
                title: "Subscriptions",
                href: "/dashboard/subscriptions",
                icon: CreditCard,
              },
            ],
          },
        ]
      : []),

  ] satisfies MainNavItem[],
});
