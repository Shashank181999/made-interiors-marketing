import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Made Interiors - Marketing Automation',
  description: 'Automated marketing system for Made Interiors Dubai',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto bg-black pt-16 lg:pt-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
