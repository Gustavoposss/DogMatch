'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  Sparkles,
  PawPrint,
  Heart,
  Star,
  Settings,
  LogOut,
  LifeBuoy,
} from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Swipe', href: '/swipe', icon: Sparkles },
  { name: 'Meus Pets', href: '/pets', icon: PawPrint },
  { name: 'Matches', href: '/matches', icon: Heart },
  { name: 'Planos', href: '/plans', icon: Star },
  { name: 'Configurações', href: '/settings', icon: Settings },
  { name: 'Suporte', href: '/support', icon: LifeBuoy },
];

type SidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function Sidebar({ className = '', onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside
      className={`relative flex h-full w-64 flex-col border-r border-[var(--card-border)] bg-[var(--background-dark)] p-6 ${className}`}
    >
      <div className="mb-8 flex-shrink-0">
        <Link href="/home" className="flex items-center gap-3 mb-2">
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src="/logopardepatas-clean.svg"
              alt="Par de Patas"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--primary)]">Par de Patas</h1>
            <p className="text-xs text-[var(--foreground-secondary)]">Conexões Caninas</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto pb-24">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary-glow)]'
                  : 'text-[var(--foreground-secondary)] hover:bg-[var(--card-bg)] hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={() => {
            logout();
            onNavigate?.();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--card-bg)] px-4 py-3 text-sm font-medium text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--error)] hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}

