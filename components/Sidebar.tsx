'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Mail,
  FileText,
  Settings,
  Zap,
  TrendingUp,
  Search,
  Eye,
  Database,
  Menu,
  X,
  CalendarCheck,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Meetings', href: '/meetings', icon: CalendarCheck },
  { name: 'Scraping', href: '/scraping', icon: Search },
  { name: 'Campaigns', href: '/campaigns', icon: Mail },
  { name: 'Templates', href: '/templates', icon: FileText },
  { name: 'Preview Email', href: '/preview-email', icon: Eye },
  { name: 'Automation', href: '/automation', icon: Zap },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Optimize', href: '/optimize', icon: Database },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/made-CPWcAThC.svg"
            alt="Made Interiors"
            width={120}
            height={40}
            priority
          />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-zinc-900 text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo - Hidden on mobile (shown in header) */}
        <div className="hidden lg:block p-6 border-b border-zinc-800">
          <div className="flex items-center justify-center">
            <Image
              src="/made-CPWcAThC.svg"
              alt="Made Interiors"
              width={180}
              height={70}
              priority
            />
          </div>
          <p className="text-xs text-zinc-500 mt-3 text-center">Marketing Automation</p>
        </div>

        {/* Mobile Logo spacer */}
        <div className="lg:hidden h-16 border-b border-zinc-800" />

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-red-500 text-white font-medium'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Status */}
        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-zinc-400">Automation Active</span>
          </div>
        </div>
      </div>
    </>
  );
}
