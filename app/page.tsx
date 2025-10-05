'use client';

import React, { useState, useEffect } from 'react';
import { HabitRow } from './components/HabitRow';
import { NotesSection } from './components/NotesSection';
import { MonthlyOverview } from './components/MonthlyOverview';
import { HabitData, HabitCompletion } from './types';
import { loadHabitData, saveHabitData } from './utils/storage';
import { getCurrentMonth, getDaysInMonth, getMonthName } from './utils/dateUtils';

export default function HabitTracker() {
  const [habitData, setHabitData] = useState<HabitData>({
    habits: [],
    completions: [],
    notes: []
  });
  const [currentDate, setCurrentDate] = useState(getCurrentMonth());

  // Load data on component mount
  useEffect(() => {
    const data = loadHabitData();
    setHabitData(data);
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    saveHabitData(habitData);
  }, [habitData]);

  const days = getDaysInMonth(currentDate.year, currentDate.month);

  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabitData(prevData => {
      const existingCompletion = prevData.completions.find(
        c => c.habitId === habitId && c.date === date
      );

      let newCompletions: HabitCompletion[];

      if (existingCompletion) {
        // Toggle existing completion
        newCompletions = prevData.completions.map(c =>
          c.habitId === habitId && c.date === date
            ? { ...c, completed: !c.completed }
            : c
        );
      } else {
        // Create new completion
        newCompletions = [
          ...prevData.completions,
          { habitId, date, completed: true }
        ];
      }

      return {
        ...prevData,
        completions: newCompletions
      };
    });
  };

  const saveNote = (date: string, note: string) => {
    setHabitData(prevData => {
      const existingNoteIndex = prevData.notes.findIndex(n => n.date === date);
      let newNotes;

      if (existingNoteIndex >= 0) {
        // Update existing note
        newNotes = [...prevData.notes];
        newNotes[existingNoteIndex] = { date, note };
      } else {
        // Create new note
        newNotes = [...prevData.notes, { date, note }];
      }

      return {
        ...prevData,
        notes: newNotes
      };
    });
  };

  const deleteNote = (date: string) => {
    setHabitData(prevData => ({
      ...prevData,
      notes: prevData.notes.filter(n => n.date !== date)
    }));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      if (direction === 'next') {
        return prev.month === 12 
          ? { year: prev.year + 1, month: 1 }
          : { year: prev.year, month: prev.month + 1 };
      } else {
        return prev.month === 1 
          ? { year: prev.year - 1, month: 12 }
          : { year: prev.year, month: prev.month - 1 };
      }
    });
  };

  const monthName = getMonthName(currentDate.month);
  const currentMonthDisplay = `${monthName} ${currentDate.year}`;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
          >
            ← Previous Month
          </button>
          
          <button
            onClick={() => setCurrentDate(getCurrentMonth())}
            className="px-4 py-2 bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-lg transition-colors"
          >
            Today
          </button>
          
          <button
            onClick={() => navigateMonth('next')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
          >
            Next Month →
          </button>
        </div>

        {/* Monthly Overview */}
        <MonthlyOverview
          habits={habitData.habits}
          completions={habitData.completions}
          totalDays={days.length}
          currentMonth={currentMonthDisplay}
        />

        {/* Habit Tracking Grid */}
        <div className="space-y-4 mb-8">
          {habitData.habits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              days={days}
              completions={habitData.completions}
              onToggleCompletion={toggleHabitCompletion}
            />
          ))}
        </div>

        {/* Notes Section */}
        <NotesSection
          days={days}
          notes={habitData.notes}
          onSaveNote={saveNote}
          onDeleteNote={deleteNote}
        />

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8 pb-4">
          <p>Stay consistent, build better habits! 💪</p>
        </div>
      </div>
    </div>
  );
}