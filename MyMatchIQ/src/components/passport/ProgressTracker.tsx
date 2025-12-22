import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface ProgressTrackerProps {
  currentDay: number;
  totalDays?: number;
  className?: string;
}

export function ProgressTracker({ currentDay, totalDays = 7, className = '' }: ProgressTrackerProps) {
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-600 text-sm">Day {currentDay} of {totalDays}</span>
        <span className="text-slate-600 text-sm">{Math.round((currentDay / totalDays) * 100)}%</span>
      </div>

      <div className="flex items-center gap-2">
        {days.map((day, index) => (
          <div key={day} className="flex items-center flex-1">
            {/* Day circle */}
            <div className="relative flex-shrink-0">
              {day < currentDay ? (
                // Completed
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md"
                >
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </motion.div>
              ) : day === currentDay ? (
                // Current
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
                >
                  <span className="text-white text-xs">{day}</span>
                </motion.div>
              ) : (
                // Upcoming
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <span className="text-slate-400 text-xs">{day}</span>
                </div>
              )}
            </div>

            {/* Connector line */}
            {index < days.length - 1 && (
              <div className="flex-1 h-1 mx-1">
                <div
                  className={`h-full rounded ${
                    day < currentDay
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : 'bg-slate-100'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
