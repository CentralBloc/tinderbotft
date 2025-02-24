export interface NavItem {
  title: string;
  href: string;
  icon?: any;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export interface UserInterface {
  is_superuser: boolean;
  is_active: boolean;
  id: string;
  username: string;
  email: string;
}

export interface MessagesList {
  id: string;
  from: string;
  to: string;
  message: string;
  pageNumber: string;
  cost: number;
  status: "success" | "failed" | "pending";
  createdAt: string;
}

export interface SmsInterface {
  data: MessagesList[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPageUrl: string | null;
  page: number;
  pageSize: number;
  previousPageUrl: string | null;
  total: number;
  totalPages: number;
}

export interface PlansInterface {
  id: string;
  bot_name: number;
  proxy: ProxyInterface | null;
  status: string;
}

export interface PaymentHistoryInterface {
  id: string;
  pack: string;
  status: "En attente" | "Succès" | "Échoué";
}

export interface StatsInterface {
  type: "credit" | "message";
  value: number;
}

export interface BotsInterface {
  id: string;
  min_swipe_times: number;
  max_swipe_times: number;
  min_right_swipe_percentage: number;
  max_right_swipe_percentage: number;
  status: string;
  scheduled_time: string;
  scheduled_time_2: string | undefined;
  related_day: number;
  user: string;
}

export interface ActionsInterface {
  id: string;
  min_swipe_times: number | undefined;
  max_swipe_times: number | undefined;
  min_right_swipe_percentage: number | undefined;
  max_right_swipe_percentage: number | undefined;
  status: string;
  scheduled_time: string;
  scheduled_time_2: string | undefined;
  related_day: number;
  type: string;
  insta_list?: string;
  bio_list?: string;
}

export interface ProxyInterface {
  id: string;
  name: string;
  host: string;
  port: number;
  password: string;
  username: string;
  rotation_link: string | undefined;
  status: string;
  type: string;
}

export interface BotAccountInterface {
  id: string;
  title: string;
  modele: ModelInterface | undefined | string;
  token: string;
  refresh_token: string | null;
  strategy: string | StrategyInterface | undefined;
  status: string;
  progress: number | undefined;
  device_id: string | undefined;
  min_age: number | undefined;
  max_age: number | undefined;
  distance: number | undefined;
  tinder_bio : string | undefined;
  likes: number | undefined;
  swipes: number | undefined;
  matches: number | undefined;
  profile_url: string | undefined;
  timezone_field: string;
}

export interface StrategyInterface {
  id: string;
  name: string;
  description: string;
  days_number: number;
  proxy: ProxyInterface | undefined;
}

export interface ModelInterface {
  id: string;
  name: string;
  description: string;
}

export interface AllModelsInterface {
  id: string;
  name: string;
  description: string;
  account_count: number;
}
