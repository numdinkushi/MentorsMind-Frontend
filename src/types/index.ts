export interface Review {
  id: string;
  mentorId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
  isVerified: boolean;
  mentorResponse?: {
    text: string;
    date: string;
  };
  isFlagged?: boolean;
}

export interface RatingDistribution {
  star: number;
  count: number;
}

export interface RatingStats {
  average: number;
  totalReviews: number;
  distribution: RatingDistribution[];
  trends: {
    labels: string[];
    values: number[];
  };
}

export type OnboardingStepId = 'profile' | 'wallet' | 'availability' | 'pricing' | 'tutorial' | 'complete';

export type LearnerStepId = 'goals' | 'assessment' | 'matching' | 'wallet' | 'tutorial' | 'complete';

export interface LearnerGoal {
  id: string;
  label: string;
  icon: string;
}

export interface SkillLevel {
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface MentorMatch {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  hourlyRate: number;
  matchScore: number;
  avatar: string;
}

export interface LearnerOnboardingState {
  currentStep: LearnerStepId;
  completedSteps: LearnerStepId[];
  isDismissed: boolean;
  isCelebrated: boolean;
  data: {
    goals?: string[];
    skills?: SkillLevel[];
    selectedMentor?: string;
    wallet?: { address: string; connected: boolean };
  };
}

// ── Wallet ────────────────────────────────────────────────────────────────────

export type AssetCode = 'XLM' | 'USDC' | 'yXLM';

export interface WalletAsset {
  code: AssetCode;
  balance: number;
  usdValue: number;
}

export type TxType = 'earning' | 'payout' | 'fee' | 'refund';
export type TxStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  type: TxType;
  status: TxStatus;
  amount: number;
  asset: AssetCode;
  usdAmount: number;
  description: string;
  sessionId?: string;
  date: string;
  fee?: number;
}

export interface PayoutRequest {
  id: string;
  amount: number;
  asset: AssetCode;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  completedAt?: string;
  txHash?: string;
}

export interface EarningsBySession {
  sessionId: string;
  studentName: string;
  topic: string;
  date: string;
  duration: number; // minutes
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  asset: AssetCode;
}

export interface WalletState {
  address: string;
  assets: WalletAsset[];
  pendingEarnings: number;
  availableEarnings: number;
  totalEarned: number;
  transactions: Transaction[];
  payoutHistory: PayoutRequest[];
  sessionEarnings: EarningsBySession[];
  forecastNextMonth: number;
  platformFeeRate: number; // e.g. 0.05 = 5%
}

export interface OnboardingState {
  currentStep: OnboardingStepId;
  completedSteps: OnboardingStepId[];
  isDismissed: boolean;
  isCelebrated: boolean;
  data: {
    profile?: {
      bio: string;
      specialization: string;
    };
    wallet?: {
      address: string;
      connected: boolean;
    };
    availability?: {
      timezone: string;
      slots: string[];
    };
    pricing?: {
      hourlyRate: number;
      currency: string;
    };
  };
}

// ── Learning Goals ────────────────────────────────────────────────────────────

export type GoalStatus = 'active' | 'completed' | 'paused' | 'overdue';
export type GoalCategory = 'technical' | 'career' | 'project' | 'certification' | 'soft-skills';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  completedAt?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  status: GoalStatus;
  // SMART fields
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  // Progress
  milestones: Milestone[];
  deadline: string;
  createdAt: string;
  updatedAt: string;
  sharedWithMentor: boolean;
  reminderEnabled: boolean;
  badge?: string;
  notes?: string;
}

export interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  icon: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  milestones: Omit<Milestone, 'id' | 'completed' | 'completedAt'>[];
}

export interface GoalStats {
  total: number;
  completed: number;
  active: number;
  overdue: number;
  completionRate: number;
}
