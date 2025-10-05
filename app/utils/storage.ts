import { HabitData } from '../types';

const STORAGE_KEY = 'habit-tracker-data';

export const loadHabitData = (): HabitData => {
  if (typeof window === 'undefined') {
    return getDefaultHabitData();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading habit data:', error);
  }

  return getDefaultHabitData();
};

export const saveHabitData = (data: HabitData): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving habit data:', error);
  }
};

const getDefaultHabitData = (): HabitData => ({
  habits: [
    { id: '1', name: 'Exercise', color: '#ef4444', icon: '💪' },
    { id: '2', name: 'Read', color: '#3b82f6', icon: '📚' },
    { id: '3', name: 'Meditate', color: '#8b5cf6', icon: '🧘' },
    { id: '4', name: 'Water (8 glasses)', color: '#06b6d4', icon: '💧' },
    { id: '5', name: 'Sleep 8h', color: '#6366f1', icon: '😴' },
  ],
  completions: [],
  notes: []
});