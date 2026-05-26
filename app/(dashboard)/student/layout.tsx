import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EduTrack — Student Portal',
  description: 'View assignments, submit answers and track your grades.',
};

export default function StudentSectionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
