import { useEffect } from 'react';
import { useToastStore, type Toast } from '../store/useToastStore';

const AUTO_DISMISS_MS = 4000;

/** Renders the achievement-unlock toast queue, fixed to the bottom-right of the viewport. */
export function AchievementToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} dismiss={dismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, dismiss }: { toast: Toast; dismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => dismiss(toast.id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast.id, dismiss]);

  return (
    <div
      role="status"
      className="animate-toast-in pointer-events-auto flex items-center gap-3 rounded-lg border border-[var(--gold)] bg-[var(--bg-surface-raised)] px-4 py-3 shadow-lg shadow-black/50 [box-shadow:0_0_24px_-4px_var(--house-glow)]"
    >
      <span className="text-2xl" aria-hidden="true">
        🏆
      </span>
      <div>
        <p className="font-display font-semibold text-[var(--gold-bright)]">Achievement Unlocked!</p>
        <p className="text-sm text-[var(--text-secondary)]">{toast.achievement.name}</p>
      </div>
      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        aria-label="Dismiss"
        className="ml-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
      >
        ✕
      </button>
    </div>
  );
}
