export interface Habit {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
}

export interface DayNote {
  date: string; // YYYY-MM-DD format
  note: string;
}

export interface HabitData {
  habits: Habit[];
  completions: HabitCompletion[];
  notes: DayNote[];
}

export interface StreakInfo {
  current: number;
  longest: number;
}