import React, { lazy, useEffect, useState, Suspense } from 'react';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import OfflineBanner from './components/ui/OfflineBanner';
import NetworkErrorToast from './components/ui/NetworkErrorToast';
import ThemeToggle from './components/ui/ThemeToggle';          // ← NEW
import { ThemeProvider } from './contexts/ThemeContext';         // ← NEW

import SkipNavigation from './components/a11y/SkipNavigation';
import LiveRegion from './components/a11y/LiveRegion';
import AccessibilityPanel from './components/a11y/AccessibilityPanel';
import { useReviews } from './hooks/useReviews';
import { usePerformance } from './hooks/usePerformance';
import { preloadCriticalResources } from './utils/performance.utils';
import MetricCard from './components/charts/MetricCard';

const loadMentorOnboarding   = () => import('./components/onboarding/MentorOnboarding');
const loadLearnerOnboarding  = () => import('./pages/LearnerOnboarding');
const loadMentorWallet       = () => import('./pages/MentorWallet');
const loadMentorSearch       = () => import('./pages/MentorSearch');
const loadMentorSessions     = () => import('./pages/MentorSessions');
const loadSettings           = () => import('./pages/Settings');
const loadMentorProfileSetup = () => import('./pages/MentorProfileSetup');
const loadLearningGoals      = () => import('./pages/LearningGoals');
const loadRatingBreakdown    = () => import('./components/reviews/RatingBreakdown');
const loadReviewForm         = () => import('./components/reviews/ReviewForm');
const loadReviewList         = () => import('./components/reviews/ReviewList');
const loadLineChart          = () => import('./components/charts/LineChart');
const loadBarChart           = () => import('./components/charts/BarChart');
const loadPieChart           = () => import('./components/charts/PieChart');
const loadAreaChart          = () => import('./components/charts/AreaChart');

const MentorOnboarding   = lazy(loadMentorOnboarding);
const LearnerOnboarding  = lazy(loadLearnerOnboarding);
const MentorWallet       = lazy(loadMentorWallet);
const MentorSearch       = lazy(loadMentorSearch);
const MentorSessions     = lazy(loadMentorSessions);
const Settings           = lazy(loadSettings);
const MentorProfileSetup = lazy(() => loadMentorProfileSetup().then(m => ({ default: m.MentorProfileSetup })));
const LearningGoals      = lazy(loadLearningGoals);
const MentorDashboard    = lazy(() => import('./pages/MentorDashboard'));
const RatingBreakdown    = lazy(loadRatingBreakdown);
const ReviewForm         = lazy(loadReviewForm);
const ReviewList         = lazy(loadReviewList);
const LineChart          = lazy(loadLineChart);
const BarChart           = lazy(loadBarChart);
const PieChart           = lazy(loadPieChart);
const AreaChart          = lazy(loadAreaChart);

type AppView =
  | 'onboarding' | 'learner' | 'wallet' | 'search'
  | 'reviews' | 'analytics' | 'profile' | 'sessions'
  | 'settings' | 'goals' | 'dashboard';

const earningsData = [
  { label: 'Jan', earnings: 1200, sessions: 8 },
  { label: 'Feb', earnings: 1800, sessions: 12 },
  { label: 'Mar', earnings: 1500, sessions: 10 },
  { label: 'Apr', earnings: 2200, sessions: 15 },
  { label: 'May', earnings: 2800, sessions: 18 },
  { label: 'Jun', earnings: 3100, sessions: 21 },
];

const sessionsByCategory = [
  { label: 'Web Dev',    value: 42 },
  { label: 'Blockchain', value: 28 },
  { label: 'Design',     value: 18 },
  { label: 'DevOps',     value: 12 },
];

const ratingTrend = [
  { label: 'Jan', rating: 4.2 },
  { label: 'Feb', rating: 4.4 },
  { label: 'Mar', rating: 4.3 },
  { label: 'Apr', rating: 4.6 },
  { label: 'May', rating: 4.7 },
  { label: 'Jun', rating: 4.8 },
];

// ─── Analytics dashboard sub-page ────────────────────────────────────────────
function AnalyticsDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div>
        <h2 className="text-3xl font-bold mb-1 text-gray-900 dark:text-gray-50">Analytics</h2>
        <p className="text-gray-500 dark:text-gray-400">Your platform metrics at a glance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Earnings" value="$12,400" change={18.2}  changeLabel="vs last month" prefix="" />
        <MetricCard title="Sessions"       value={84}       change={12.5}  changeLabel="vs last month" />
        <MetricCard title="Avg. Rating"    value="4.8"      change={2.1}   changeLabel="vs last month" suffix="★" />
        <MetricCard title="Students"       value={136}      change={-3.4}  changeLabel="vs last month" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <AreaChart
          data={earningsData}
          series={[{ key: 'earnings', name: 'Earnings' }]}
          title="Monthly Earnings"
          description="Cumulative earnings over time"
          xAxisKey="label"
          valuePrefix="$"
          exportable
          exportFilename="earnings-chart"
        />
        <LineChart
          data={ratingTrend}
          series={[{ key: 'rating', name: 'Avg Rating' }]}
          title="Rating Trend"
          description="Average session rating per month"
          xAxisKey="label"
          zoomable
          exportable
          exportFilename="rating-trend"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <BarChart
          data={earningsData}
          series={[{ key: 'sessions', name: 'Sessions' }]}
          title="Sessions per Month"
          xAxisKey="label"
          exportable
          exportFilename="sessions-bar"
        />
        <PieChart
          data={sessionsByCategory}
          title="Sessions by Category"
          description="Proportional breakdown of session types"
          donut
          exportable
          exportFilename="sessions-pie"
        />
      </div>
    </div>
  );
}

// ─── Inner app — rendered inside ThemeProvider ────────────────────────────────
function AppInner() {
  const isOnline = useOnlineStatus();
  const [view, setView]               = useState<AppView>('onboarding');
  const [showForm, setShowForm]       = useState(false);
  const [a11yOpen, setA11yOpen]       = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const { dashboard, budgetStatus }   = usePerformance();

  const {
    reviews, stats, addReview, voteHelpful,
    addMentorResponse, filterRating, setFilterRating,
    currentPage, totalPages, paginate,
  } = useReviews('m1');

  const handleViewChange = (next: AppView, label: string) => {
    setView(next);
    setAnnouncement(`Navigated to ${label}`);
  };

  useEffect(() => { preloadCriticalResources(); }, []);

  const [networkError, setNetworkError] = useState<string | null>(null);

  useEffect(() => {
    const handleNetworkError = (e: any) => {
      setNetworkError(e.detail?.message || 'A network error occurred.');
    };
    window.addEventListener('api-network-error', handleNetworkError);
    return () => window.removeEventListener('api-network-error', handleNetworkError);
  }, []);

  const preloaders: Record<AppView, () => Promise<unknown>> = {
    search:     loadMentorSearch,
    learner:    loadLearnerOnboarding,
    onboarding: loadMentorOnboarding,
    profile:    loadMentorProfileSetup,
    wallet:     loadMentorWallet,
    analytics:  loadAreaChart,
    reviews:    loadReviewList,
    sessions:   loadMentorSessions,
    settings:   loadSettings,
    goals:      loadLearningGoals,
    dashboard:  () => Promise.resolve(),
  };

  return (
    /*
     * Root wrapper
     *   light → bg-gray-50 / text-gray-900  (identical to original)
     *   dark  → bg-gray-950 / text-gray-100
     *   transition-colors gives the 300 ms smooth fade on theme switch
     */
    <div
      className={[
        'min-h-screen font-sans pb-20',
        'bg-gray-50 text-gray-900',
        'dark:bg-gray-950 dark:text-gray-100',
        'transition-colors duration-300 ease-in-out',
        !isOnline ? 'pt-10' : '',
      ].join(' ')}
    >
      <OfflineBanner />

      {networkError && (
        <NetworkErrorToast
          message={networkError}
          onRetry={() => window.dispatchEvent(new Event('online'))}
          onClose={() => setNetworkError(null)}
        />
      )}

      <SkipNavigation />
      <LiveRegion message={announcement} />
      <AccessibilityPanel isOpen={a11yOpen} onClose={() => setA11yOpen(false)} />

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <nav
        id="main-nav"
        aria-label="Main navigation"
        className={[
          'sticky top-0 z-50 border-b',
          'border-gray-100 bg-white',
          'dark:border-gray-800 dark:bg-gray-900',
          'transition-colors duration-300 ease-in-out',
        ].join(' ')}
      >
        {/* Top bar */}
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stellar font-bold text-white">
              M
            </div>
            <span className="text-xl font-bold tracking-tight">
              MentorMinds <span className="text-stellar">Stellar</span>
            </span>
          </div>

          {/* Right controls: a11y + ThemeToggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setA11yOpen(true)}
              aria-label="Open accessibility settings"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-stellar/20 bg-stellar/10 text-stellar transition-colors duration-300"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="3" strokeWidth="2" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                />
              </svg>
            </button>

            {/* ← ThemeToggle lives here in the navbar */}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile nav tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar md:hidden py-2 px-1">
          {[
            { id: 'onboarding', label: 'Mentor Onboarding' },
            { id: 'goals',      label: 'Goals' },
            { id: 'wallet',     label: 'Wallet' },
            { id: 'analytics',  label: 'Analytics' },
            { id: 'reviews',    label: 'Ratings & Reviews' },
            { id: 'profile',    label: 'Profile Setup' },
            { id: 'search',     label: 'Search' },
            { id: 'sessions',   label: 'Manage Sessions' },
            { id: 'settings',   label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleViewChange(item.id as AppView, item.label)}
              className={[
                'px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap',
                view === item.id
                  ? 'bg-white dark:bg-gray-800 shadow-sm text-stellar'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300',
              ].join(' ')}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop nav tabs */}
        <div
          className={[
            'hidden items-center gap-2 rounded-2xl p-1 md:flex mx-auto max-w-7xl px-4 pb-2',
            'bg-gray-50 dark:bg-gray-800/50',
            'transition-colors duration-300',
          ].join(' ')}
        >
          {[
            { id: 'search',     label: 'Search & Booking' },
            { id: 'learner',    label: 'Learner Onboarding' },
            { id: 'onboarding', label: 'Mentor Onboarding' },
            { id: 'sessions',   label: 'Manage Sessions' },
            { id: 'profile',    label: 'Profile Setup' },
            { id: 'wallet',     label: 'Wallet' },
            { id: 'settings',   label: 'Settings' },
            { id: 'analytics',  label: 'Analytics' },
            { id: 'reviews',    label: 'Reviews' },
          ].map((item: { id: string; label: string }) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleViewChange(item.id as AppView, item.label)}
              onMouseEnter={() => preloaders[item.id as AppView]?.()}
              onFocus={() => preloaders[item.id as AppView]?.()}
              className={[
                'rounded-xl px-4 py-2 text-sm font-bold transition-all',
                view === item.id
                  ? 'bg-white dark:bg-gray-700 text-stellar shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100',
              ].join(' ')}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main
        id="main-content"
        tabIndex={-1}
        className="max-w-7xl mx-auto px-4 pt-10 outline-none"
      >
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center text-gray-400 dark:text-gray-500">
              Loading…
            </div>
          }
        >
          {view === 'settings'   ? <Settings /> :
           view === 'onboarding' ? <MentorOnboarding /> :
           view === 'learner'    ? <LearnerOnboarding /> :
           view === 'wallet'     ? <MentorWallet isOnline={isOnline} /> :
           view === 'goals'      ? <LearningGoals /> :
           view === 'sessions'   ? <MentorSessions isOnline={isOnline} /> :
           view === 'profile'    ? <MentorProfileSetup /> :
           view === 'search'     ? <MentorSearch isOnline={isOnline} /> :
           view === 'analytics'  ? <AnalyticsDashboard /> :
           view === 'dashboard'  ? <MentorDashboard /> : (

            /* Reviews view */
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-50">
                    Mentor Feedback
                    {!isOnline && (
                      <span className="ml-3 inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/40 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-300">
                        <svg className="mr-1.5 h-2 w-2 text-amber-400" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Offline Cache
                      </span>
                    )}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    See what the community is saying about your sessions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForm(!showForm)}
                  disabled={!isOnline}
                  aria-expanded={showForm}
                  aria-controls="review-form"
                  className={[
                    'rounded-xl px-6 py-2.5 font-bold shadow-lg transition-all',
                    !isOnline
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none'
                      : 'bg-stellar text-white shadow-stellar/20 hover:bg-stellar-dark',
                  ].join(' ')}
                >
                  {showForm ? 'Cancel Review' : 'Write a Review'}
                </button>
              </div>

              {showForm && (
                <div id="review-form">
                  <ReviewForm
                    onSubmit={(data) => {
                      addReview({ ...data, reviewerId: `user-${Date.now()}` });
                      setShowForm(false);
                      setAnnouncement('Your review has been submitted.');
                    }}
                    onCancel={() => setShowForm(false)}
                  />
                </div>
              )}

              <RatingBreakdown stats={stats} />

              <div
                className={[
                  'rounded-[2.5rem] border p-8 shadow-sm md:p-12',
                  'border-gray-100 bg-white',
                  'dark:border-gray-800 dark:bg-gray-900',
                  'transition-colors duration-300',
                ].join(' ')}
              >
                <ReviewList
                  reviews={reviews}
                  stats={stats}
                  onVoteHelpful={voteHelpful}
                  onFilterChange={setFilterRating}
                  currentFilter={filterRating}
                  onAddResponse={addMentorResponse}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={paginate}
                />
              </div>
            </div>
          )}
        </Suspense>
      </main>

      {/* ── Performance monitor sidebar ──────────────────────────────────── */}
      <aside
        className={[
          'fixed bottom-16 left-4 z-40 hidden w-72 rounded-[1.5rem] border p-4 shadow-xl backdrop-blur md:block',
          'border-gray-100 bg-white/95',
          'dark:border-gray-800 dark:bg-gray-900/95',
          'transition-colors duration-300',
        ].join(' ')}
      >
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-stellar">
          Performance Monitor
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {dashboard.map((item: { label: string; value: number | string | null; unit?: string }) => (
            <div
              key={item.label}
              className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-3 text-center transition-colors duration-300"
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
                {item.label}
              </div>
              <div className="mt-1 text-sm font-black text-gray-900 dark:text-gray-100">
                {item.value ?? '--'}{item.unit}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-gray-500 dark:text-gray-400">
          Budget: {budgetStatus.jsBudgetKb}KB JS / {budgetStatus.chunkBudgetKb}KB chunks / {budgetStatus.imageBudgetKb}KB images
        </div>
      </aside>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        className={[
          'fixed bottom-0 left-0 right-0 border-t py-4 text-center text-[10px] backdrop-blur-sm',
          'border-gray-100 bg-white/80 text-gray-400',
          'dark:border-gray-800 dark:bg-gray-900/80 dark:text-gray-500',
          'transition-colors duration-300',
        ].join(' ')}
      >
        Demo Version 1.0 • Built with Vite, React &amp; Tailwind CSS • Powered by Stellar
      </footer>
    </div>
  );
}

// ─── Root export — wraps everything in ThemeProvider ─────────────────────────
function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

export default App;