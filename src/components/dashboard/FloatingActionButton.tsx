import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-[var(--shadow-fab)] md:hidden z-40 tap-feedback"
      size="icon"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
}
