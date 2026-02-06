import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileHeaderProps {
  onSearch?: () => void;
  onFilter?: () => void;
}

export function MobileHeader({ onSearch, onFilter }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-14 bg-card border-b border-border flex items-center justify-between px-4 md:hidden">
      <h1 className="text-xl font-semibold text-foreground">Kursverwaltung</h1>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={onSearch}>
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onFilter}>
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
