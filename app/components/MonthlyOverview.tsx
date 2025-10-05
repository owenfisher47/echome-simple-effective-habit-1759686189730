'use client';

import React from 'react';
import { TrendingUp, Target, Calendar } from 'lucide-react';
import { Habit, HabitCompletion } from '../types';
import { getCompletionRate, calculateStreak } from '../utils/habitUtils';

interface MonthlyOverviewProps {
  habits: Habit[];
  completions: HabitCompletion[];
  totalDays: number;
  currentMonth: string;
}

export const MonthlyOverview: React.FC<MonthlyOverviewProps> = ({
  habits,
  completions,
  totalDays,
  currentMonth
}) => {
  const overallStats = habits.map(habit => ({
    ...habit,
    completionRate: getCompletionRate(habit.id, completions, totalDays),
    currentStreak: calculateStreak(habit.id, completions).current,
    longestStreak: calculateStreak(habit.id, completions).longest
  }));

  const averageCompletionRate = overallStats.reduce(
    (sum, habit) => sum + habit.completionRate, 0
  ) / habits.length;

  const totalActiveStreaks = overallStats.filter(habit => habit.currentStreak > 0).length;

  return (
    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6 mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
        <Calendar className="text-primary-600" />
        {currentMonth} Habit Tracker
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="text-green-600" size={20} />
            <span className="font-medium text-gray-700">Overall Progress</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {Math.round(averageCompletionRate)}%
          </div>
          <div className="text-sm text-gray-600">Average completion rate</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-orange-600" size={20} />
            <span className="font-medium text-gray-700">Active Streaks</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {totalActiveStreaks}
          </div>
          <div className="text-sm text-gray-600">of {habits.length} habits</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-600">🏆</span>
            <span className="font-medium text-gray-700">Best Streak</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {Math.max(...overallStats.map(h => h.longestStreak), 0)}
          </div>
          <div className="text-sm text-gray-600">days in a row</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        {overallStats.map(habit => (
          <div key={habit.id} className="bg-white/50 rounded p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{habit.icon}</span>
              <span className="font-medium text-sm">{habit.name}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600">{Math.round(habit.completionRate)}%</span>
              {habit.currentStreak > 0 && (
                <span className="text-orange-600">🔥 {habit.currentStreak}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};