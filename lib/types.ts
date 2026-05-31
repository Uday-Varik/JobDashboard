export type ApplicationStage =
  | "wishlist"
  | "applied"
  | "phone_screen"
  | "technical"
  | "final_round"
  | "offer"
  | "rejected"
  | "withdrawn";

export const STAGES: { id: ApplicationStage; label: string; color: string }[] = [
  { id: "wishlist",     label: "Wishlist",     color: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700" },
  { id: "applied",      label: "Applied",      color: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  { id: "phone_screen", label: "Phone Screen", color: "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
  { id: "technical",    label: "Technical",    color: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800" },
  { id: "final_round",  label: "Final Round",  color: "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800" },
  { id: "offer",        label: "Offer",        color: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800" },
  { id: "rejected",     label: "Rejected",     color: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800" },
  { id: "withdrawn",    label: "Withdrawn",    color: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700" },
];

export const ACTIVE_STAGES: ApplicationStage[] = [
  "wishlist", "applied", "phone_screen", "technical", "final_round", "offer",
];

export interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  location?: string;
  logo_url?: string;
  created_at: string;
}

export interface Application {
  id: string;
  company_id: string;
  company?: Company;
  role_title: string;
  stage: ApplicationStage;
  applied_date?: string;
  salary_min?: number;
  salary_max?: number;
  job_url?: string;
  description?: string;
  priority: "low" | "medium" | "high";
  created_at: string;
  updated_at: string;
  contacts?: Contact[];
  notes?: Note[];
  follow_ups?: FollowUp[];
}

export interface Contact {
  id: string;
  application_id?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  linkedin?: string | null;
  role?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface Note {
  id: string;
  application_id: string;
  content: string;
  created_at: string;
}

export interface FollowUp {
  id: string;
  application_id: string;
  application?: Application;
  due_date: string;
  message?: string;
  completed: boolean;
  created_at: string;
}

export interface AnalyticsData {
  totalApplications: number;
  activeApplications: number;
  responseRate: number;
  offerRate: number;
  avgDaysToResponse: number;
  stageBreakdown: { stage: ApplicationStage; count: number; label: string }[];
  weeklyVolume: { week: string; count: number }[];
  conversionRates: { from: string; to: string; rate: number }[];
}
