export const routes = {
  index: "/",

  auth: {
    login: "/login",
    register: "/register",
    confirmEmail: "/register/confirm-email",
    forgotPassword: "/login/forgot-password",
    reserPassword: "/login/reset-password",
  },

  dashboard: {
    home: "/dashboard/home",
    credits: {
      index: "/dashboard/credits",
      add: "/dashboard/credits/add-bot",
      update: (id: string) => `/dashboard/credits/update-bot/${id}`,
      buyCredits: (id: string) => `/dashboard/credits/buy-credit/${id}`,
    },
    sms: {
      index: "/dashboard/sms",
      send: "/dashboard/sms/send-sms",
      viewSms: (id: string) => `/dashboard/sms/${id}`,
      updateSms: (id: string) => `/dashboard/sms/update-sms/${id}`,
    },
    profile: "/dashboard/profile",
    account: {
      index: "/dashboard/accounts",
      view: (id: string) => `/dashboard/accounts/${id}`,
      update: (id: string) => `/dashboard/accounts/update-account/${id}`,
      logs: (id: string) => `/dashboard/accounts/logs/${id}`,
      add: "/dashboard/accounts/add-account",
    },
    strategy: {
      index: "/dashboard/strategies",
      update: (id: string) => `/dashboard/strategies/update-strategy/${id}`,
      add: "/dashboard/strategies/add-strategy",
      config: (id: string) => `/dashboard/strategies/config-strategy/${id}`,
    },
    proxy: {
      index: "/dashboard/proxies",
      update: (id: string) => `/dashboard/proxies/update-proxy/${id}`,
      add: "/dashboard/proxies/add-proxy",
    },
    model: {
      index: "/dashboard/models",
      update: (id: string) => `/dashboard/models/update-model/${id}`,
      add: "/dashboard/models/add-model",
    },
    admin: {
      index: "/dashboard/admin",
      update: (id: string) => `/dashboard/admin/update-admin/${id}`,
      add: "/dashboard/admin/add-admin",
      plans: {
        index: "/dashboard/admin/plans",
        add: "/dashboard/admin/plans/add-plan",
        update: (id: string) => `/dashboard/admin/plans/update-plan/${id}`,
      },
      subscriptions:{
        index: "/dashboard/admin/subscriptions",
        update: (id: string) => `/dashboard/admin/subscriptions/update-subscription/${id}`,
        add: "/dashboard/admin/subscriptions/add-subscription",
      },
    },
    insta: {
      index: "/dashboard/insta",
      connect: "/dashboard/insta/connect",
      strat: {
        index: "/dashboard/insta/strat",
        add: "/dashboard/insta/strat/add",
        update: (id: string) => `/dashboard/insta/strat/update/${id}`,
        config: (id: string) => `/dashboard/insta/strat/config/${id}`,
      }

    }
  },
};
