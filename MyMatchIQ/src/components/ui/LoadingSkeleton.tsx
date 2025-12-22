/**
 * Loading Skeleton Components
 * Used for loading states in AI-powered features
 */
export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}

export function AICoachLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-purple-100 rounded-full flex-shrink-0 animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export function AIInsightsLoadingSkeleton() {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-200 rounded-xl animate-pulse"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-2 border-gray-200 rounded-2xl p-4">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AssessmentLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

