'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { Habit, HabitCompletion } from '../types';
import { formatDate, isFutureDate } from '../utils/dateUtils';
import { isHabitCompletedOnDate, calculateStreak, getCompletionRate } from '../utils/habitUtils';

interface HabitRowProps {
  habit: Habit;
  days: Date[];
  completions: HabitCompletion[];
  onToggleCompletion: (habitId: string, date: string) => void;
}

export const HabitRow: React.FC<HabitRowProps> = ({
  habit,
  days,
  completions,
  onToggleCompletion
}) => {
  const streak = calculateStreak(habit.id, completions);
  const completionRate = getCompletionRate(habit.id, completions, days.length);

  const getStreakClass = (streakCount: number) => {
    if (streakCount >= 7) return 'streak-high';
    if (streakCount >= 3) return 'streak-medium';
    return 'streak-low';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{habit.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{habit.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className={`streak-indicator ${getStreakClass(streak.current)}`}>
                🔥 {streak.current} day streak
              </span>
              <span>Best: {streak.longest}</span>
              <span>{Math.round(completionRate)}% complete</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 md:grid-cols-14 lg:grid-cols-21 xl:grid-cols-31 gap-1">
        {days.map((day) => {
          const dateString = formatDate(day);
          const isCompleted = isHabitCompletedOnDate(habit.id, dateString, completions);
          const isFuture = isFutureDate(day);
          const dayNumber = day.getDate();

          return (
            <div key={dateString} className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">{dayNumber}</div>
              <button
                className={`habit-checkbox ${isCompleted ? 'completed' : ''} ${
                  isFuture ? 'opacity-30 cursor-not-allowed' : ''
                }`}
                onClick={() => !isFuture && onToggleCompletion(habit.id, dateString)}
                disabled={isFuture}
                style={{ 
                  backgroundColor: isCompleted ? habit.color : 'transparent',
                  borderColor: isCompleted ? habit.color : undefined
                }}
              >
                {isCompleted && <Check size={16} className="text-white" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};