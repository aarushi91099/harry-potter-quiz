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
      className="pointer-events-auto flex items-center gap-3 rounded-lg border border-[var(--house-primary)] bg-white px-4 py-3 shadow-lg dark:bg-slate-900"
    >
      <span className="text-2xl">🏆</span>
      <div>
        <p className="font-semibold text-slate-900 dark:text-slate-100">Achievement Unlocked!</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">{toast.achievement.name}</p>
      </div>
      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        aria-label="Dismiss"
        className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
      >
        ✕
      </button>
    </div>
  );
}
