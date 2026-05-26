import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EduTrack — Teacher Portal',
  description: 'Manage assignments, review submissions and grade students.',
};

export default function TeacherSectionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
