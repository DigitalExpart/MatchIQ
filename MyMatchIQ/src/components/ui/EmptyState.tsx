/**
 * Empty State Components
 * Used when data is unavailable or backend is down
 */
import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

export function EmptyState({ title, message, action, icon }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
      {icon || <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:shadow-md transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function BackendUnavailableState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      title="AI Service Unavailable"
      message="We're having trouble connecting to our AI service. Your data is safe, and you can try again in a moment."
      action={onRetry ? {
        label: 'Try Again',
        onClick: onRetry,
      } : undefined}
      icon={<WifiOff className="w-12 h-12 text-amber-500 mx-auto mb-4" />}
    />
  );
}

export function NoDataState({ message = 'No data available' }: { message?: string }) {
  return (
    <EmptyState
      title="No Data Available"
      message={message}
    />
  );
}

