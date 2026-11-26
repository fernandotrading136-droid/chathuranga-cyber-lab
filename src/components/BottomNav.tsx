import { Home, LayoutGrid, Wifi, User } from 'lucide-react';
import type { NavTab } from '../data/toolsCatalog';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

const TABS: { id: NavTab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'tools', label: 'All Tools', icon: LayoutGrid },
  { id: 'network', label: 'IP & Device', icon: Wifi },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  return (
    <nav
      aria-label="Bottom app navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#00ff66]/15 bg-[#050a07]/95 backdrop-blur-md pb-safe"
    >
      <div className="mx-auto grid h-[60px] max-w-6xl grid-cols-4 items-center">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
                isActive
                  ? 'text-[#00ff66]'
                  : 'text-[#6c967b] hover:text-[#b7e2c7]'
              }`}
            >
              <div
                className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                  isActive ? 'bg-[#00ff66]/15' : 'bg-transparent'
                }`}
              >
                <Icon
                  className="h-[20px] w-[20px]"
                  strokeWidth={isActive ? 2.4 : 1.9}
                  aria-hidden="true"
                />
              </div>
              <span className="text-[11px] font-medium tracking-tight whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
