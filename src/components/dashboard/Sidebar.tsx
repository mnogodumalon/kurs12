import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCheck,
  DoorOpen,
  ClipboardList,
  Settings,
} from 'lucide-react';
import { StatCard } from './StatCard';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats: {
    openRegistrations: number;
    coursesThisWeek: number;
    totalParticipants: number;
  };
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'courses', label: 'Kurse', icon: GraduationCap },
  { id: 'instructors', label: 'Dozenten', icon: UserCheck },
  { id: 'participants', label: 'Teilnehmer', icon: Users },
  { id: 'rooms', label: 'Räume', icon: DoorOpen },
  { id: 'registrations', label: 'Anmeldungen', icon: ClipboardList },
];

export function Sidebar({ activeTab, onTabChange, stats }: SidebarProps) {
  return (
    <aside className="w-60 h-screen bg-card border-r border-border flex flex-col fixed left-0 top-0">
      {/* Logo/App Name */}
      <div className="p-6 pb-5">
        <h1 className="text-2xl font-bold text-foreground">Kursverwaltung</h1>
      </div>

      {/* Quick Stats */}
      <div className="px-4 space-y-2 pb-8">
        <StatCard
          label="Offene Anmeldungen"
          value={stats.openRegistrations}
          highlight
          warning={stats.openRegistrations > 5}
          className="h-[60px]"
        />
        <StatCard
          label="Kurse diese Woche"
          value={stats.coursesThisWeek}
          className="h-[60px]"
        />
        <StatCard
          label="Teilnehmer gesamt"
          value={stats.totalParticipants}
          className="h-[60px]"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                "h-11",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-border">
        <button
          onClick={() => onTabChange('settings')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            activeTab === 'settings'
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className="h-4 w-4" />
          Einstellungen
        </button>
      </div>
    </aside>
  );
}
