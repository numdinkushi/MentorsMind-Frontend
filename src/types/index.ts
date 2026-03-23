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

export type SessionStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';

export interface Session {
  id: string;
  learnerId: string;
  learnerName: string;
  topic: string;
  startTime: string;
  duration: number; // in minutes
  status: SessionStatus;
  price: number;
  currency: string;
  meetingLink?: string;
}

export interface EarningsData {
  totalEarned: number;
  pendingPayout: number;
  history: {
    date: string;
    amount: number;
  }[];
}

export interface Activity {
  id: string;
  type: 'booking' | 'payment' | 'review' | 'system';
  title: string;
  description: string;
  timestamp: string;
  link?: string;
}

export interface MentorDashboardData {
  upcomingSessions: Session[];
  earnings: EarningsData;
  performance: {
    averageRating: number;
    completionRate: number;
    totalSessions: number;
  };
  recentReviews: Review[];
  activities: Activity[];
  profileCompletion: number;
  pendingMessagesCount: number;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface PaymentTransaction {
  id: string;
  type: 'session' | 'subscription' | 'refund';
  mentorId: string;
  mentorName: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  date: string; // ISO date string
  stellarTxHash: string;
  description: string;
  sessionId?: string;
  sessionTopic?: string;
}

export interface PaymentAnalytics {
  totalSpent: number;
  totalCompleted: number;
  totalPending: number;
  totalRefunded: number;
  totalFailed: number;
  transactionCount: number;
}
