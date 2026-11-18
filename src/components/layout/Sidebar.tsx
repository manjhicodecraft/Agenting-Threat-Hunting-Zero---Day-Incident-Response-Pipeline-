import { NavLink } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';
import { navigationItems } from '@/config/navigation';
import { cn } from '@/utils/cn';

interface SidebarProps {
  open: boolean;
  onNavigate: () => void;
}

export function Sidebar({ open, onNavigate }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-soc-border bg-soc-sidebar transition-transform duration-300 ease-out lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="flex items-center gap-3 border-b border-soc-border px-6 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/15 ring-1 ring-primary-500/30">
          <ShieldCheck className="h-5 w-5 text-primary-400" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-100">Threat Pipeline</p>
          <p className="text-xs text-slate-500">Security Operations Center</p>
        </div>
        <button
          type="button"
          onClick={onNavigate}
          aria-label="Close navigation"
          className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-soc-elevated hover:text-slate-100 lg:hidden"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label="Main navigation">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Operations</p>
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-500/12 text-slate-50 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.25)]'
                  : 'text-slate-400 hover:bg-soc-elevated hover:text-slate-100',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-primary-500 transition-opacity duration-200',
                    isActive ? 'opacity-100' : 'opacity-0',
                  )}
                />
                <item.icon className={cn('h-[18px] w-[18px] shrink-0', isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300')} aria-hidden />
                <span className="truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-soc-border px-6 py-4">
        <p className="text-xs leading-relaxed text-slate-500">
          Response actions run only after analyst approval. Nothing is terminated automatically.
        </p>
      </div>
    </aside>
  );
}
