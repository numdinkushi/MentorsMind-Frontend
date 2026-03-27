import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useDashboard } from '../hooks/useDashboard';
import { LearnerDashboardContent } from './LearnerDashboard';
import { MentorDashboardContent } from './MentorDashboard';

const DashboardHomeInner: React.FC = () => {
  const { role } = useDashboard();
  return role === 'mentor' ? <MentorDashboardContent /> : <LearnerDashboardContent />;
};

const DashboardHome: React.FC = () => (
  <DashboardLayout>
    <DashboardHomeInner />
  </DashboardLayout>
);

export default DashboardHome;
