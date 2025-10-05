import { HabitCompletion, StreakInfo } from '../types';
import { formatDate, parseDate } from './dateUtils';

export const calculateStreak = (
  habitId: string, 
  completions: HabitCompletion[], 
  endDate: Date = new Date()
): StreakInfo => {
  const habitCompletions = completions
    .filter(c => c.habitId === habitId && c.completed)
    .map(c => parseDate(c.date))
    .sort((a, b) => b.getTime() - a.getTime());

  if (habitCompletions.length === 0) {
    return { current: 0, longest: 0 };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Calculate current streak (counting backwards from today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let checkDate = new Date(today);
  
  for (let i = 0; i < habitCompletions.length; i++) {
    const completionDate = new Date(habitCompletions[i]);
    completionDate.setHours(0, 0, 0, 0);
    
    if (completionDate.getTime() === checkDate.getTime()) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (completionDate.getTime() < checkDate.getTime()) {
      break;
    }
  }

  // Calculate longest streak
  const allDates = habitCompletions.map(date => date.getTime()).sort((a, b) => a - b);
  
  for (let i = 0; i < allDates.length; i++) {
    if (i === 0 || allDates[i] - allDates[i - 1] <= 24 * 60 * 60 * 1000) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return { current: currentStreak, longest: longestStreak };
};

export const getCompletionRate = (
  habitId: string,
  completions: HabitCompletion[],
  totalDays: number
): number => {
  const habitCompletions = completions.filter(
    c => c.habitId === habitId && c.completed
  );
  
  return totalDays > 0 ? (habitCompletions.length / totalDays) * 100 : 0;
};

export const isHabitCompletedOnDate = (
  habitId: string,
  date: string,
  completions: HabitCompletion[]
): boolean => {
  return completions.some(
    c => c.habitId === habitId && c.date === date && c.completed
  );
};