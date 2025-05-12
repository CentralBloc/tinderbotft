export interface NavItem {
  title: string;
  href: string;
  icon?: any;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
}

export interface NavItemWithoutChildren extends NavItem {
  // No items property
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: (NavItemWithChildren | NavItemWithoutChildren)[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export interface ImageInterface {
  name: string;
  type_file: string;
  link: string;
}

export interface UserInterface {
  is_superuser: boolean;
  is_active: boolean;
  id: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  profile_picture: ImageInterface | null;
  created_at: Date;
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
  name: string;
  price: string;
  duration: number;
  description: string;
  account_number: number;
  features: string;
  billingCycle: string;
  isActive: boolean;
}

export interface SubscriptionInterface {
  id: string;
  user: UserInterface;
  plan: PlansInterface | string | undefined;
  status: "active" | "inactive" | "cancelled";
  start_date: Date;
  end_date: Date;
  billing_cycle: string;
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
  username: string | undefined;
  modele: ModelInterface | undefined | string;
  token: string;
  refresh_token: string | null;
  strategy: string | StrategyInterface | undefined;
  proxy: string | ProxyInterface | undefined;
  status: string;
  progress: number | undefined;
  device_id: string | undefined;
  min_age: number | undefined;
  max_age: number | undefined;
  distance: number | undefined;
  tinder_bio: string | undefined;
  likes: number | undefined;
  swipes: number | undefined;
  matches: number | undefined;
  profile_url: string | undefined;
  longitude: number | undefined;
  latitude: number | undefined;
  location: string | undefined;
  timezone_field: string;
  gender: string | undefined;
  gender_interest: string | undefined;
  birth_date: string | undefined;
  school: string | undefined;
  phone: string | undefined;
  email: string | undefined;
  interest: string[] | undefined;
  looking_for: string[] | undefined;
  zodiac: string | undefined;
  education: string | undefined;
  communication: string | undefined;
  photos: string[] | undefined;

}

export interface StrategyInterface {
  id: string;
  name: string;
  description: string;
  days_number: number;
  min_swipes_delay: number;
  max_swipes_delay: number;
  proxy: ProxyInterface | undefined;
}

// Add this to your existing types file or create a new one if needed

export interface PictureInterface {
  id: string
  name: string
  type_file: string
  link: string
}

export interface ModelInterface {
  id: string
  name: string
  description?: string
  image?: string | PictureInterface
  bio_list?: string[]
  threads_pp?: PictureInterface[]
  posts?: string | PictureInterface
  created_at: string
  updated_at: string
}


export interface AllModelsInterface {
  id: string;
  name: string;
  description: string;
  account_count: number;
}


export interface SwipesInterface {
  id: string;
  account: string | BotAccountInterface;
  likes: number;
  swipe_number: number;
  matches: number;
  days: number;
  strategy: string | StrategyInterface;

}

export interface InstaStratInterface {
  id: string;
  name: string;
  description: string;
  day_number: number;
  modele: string | ModelInterface;
}


export interface Picture {
  id: string
  link: string
  type_file: string
  file?: File
}

export interface InstaAction {
  id: string
  action_type: "setup" | "post" | "story" | "reels"
  insta_strat: string
  profile_pictures?: PictureInterface[]
  stories?: PictureInterface[]
  posts?: PictureInterface[]
  following_username?: string
  username?: string[] | null
  bio_list?: string[] | null
  time?: string
  related_day?: string
  created_at: string
  updated_at: string
}

export type LogType = 'error' | 'swipe' | 'match'

// Base log interface
export interface BaseLog {
  id: string
  account: string
  session?: string
  created_at: Date
}

// SwipeLog model
export interface SwipeLog extends BaseLog {
  type: 'swipe'
  swipe_direction: 'like' | 'pass'
  target_user_id: string
  target_name?: string
  success: boolean
  response_data?: any
}

// MatchLog model
export interface MatchLog extends BaseLog {
  type: 'match'
  match_id: string
  target_name?: string
  target_bio?: string
  target_photos?: string[]
}

// ErrorLog model
export interface ErrorLog extends BaseLog {
  type: 'error'
  error_type: string
  error_message: string
  stack_trace?: string
}

// Union type for all logs
export type Log = SwipeLog | MatchLog | ErrorLog

export interface SwipeAction {
  id: string
  type: string
  scheduled_time: string
  scheduled_time_2?: string
  min_swipe_times: number
  max_swipe_times: number
  min_right_swipe_percentage: number
  max_right_swipe_percentage: number
  related_day: number
}

export interface ThreadStrategyInterface {
  id: string;
  name: string;
  description: string;
  day_number: number;
  proxy: string | ProxyInterface | undefined;
}

export interface ThreadActionInterface {
  id: string;
  post_number: number;
  media_post_number: number;
  frequency: string;
  type: string;
  start_time: string;
  related_day: number;
}