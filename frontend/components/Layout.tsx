'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

import { Sidebar } from './Sidebar';

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar className="hidden lg:flex lg:fixed lg:left-0 lg:top-0 lg:h-screen" />

      <div className="flex w-full flex-col lg:ml-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-[var(--background)]/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-white/30"
          >
            <Menu className="h-4 w-4" />
            Menu
          </button>
          <div className="flex items-center gap-2 text-left">
            <div className="relative h-8 w-8">
              <Image
                src="/logopardepatas-clean.svg"
                alt="Par de Patas"
                fill
                sizes="32px"
                className="object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-tight">Par de Patas</p>
              <p className="text-xs text-[var(--foreground-secondary)] leading-tight">Conexões Caninas</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-30 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative z-10 h-full w-72 max-w-[80%]">
            <Sidebar className="h-full shadow-2xl" onNavigate={() => setIsSidebarOpen(false)} />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

