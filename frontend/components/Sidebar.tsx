'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Home', href: '/home', icon: '🏠' },
  { name: 'Meus Pets', href: '/pets', icon: '🐾' },
  { name: 'Matches', href: '/matches', icon: '💕' },
  { name: 'Mensagens', href: '/matches', icon: '💬' },
  { name: 'Planos', href: '/plans', icon: '⭐' },
  { name: 'Configurações', href: '/settings', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--background-dark)] border-r border-[var(--card-border)] p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--primary)]">Par de Patas</h1>
        <p className="text-sm text-[var(--foreground-secondary)]">Conexões Caninas</p>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary-glow)]'
                  : 'text-[var(--foreground-secondary)] hover:bg-[var(--card-bg)] hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={logout}
          className="w-full rounded-lg bg-[var(--card-bg)] px-4 py-3 text-sm font-medium text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--error)] hover:text-white"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}

