'use client';

import React, { useState } from 'react';
import { Calendar, Plus, X, Edit3 } from 'lucide-react';
import { DayNote } from '../types';
import { formatDate, parseDate, isToday } from '../utils/dateUtils';

interface NotesSectionProps {
  days: Date[];
  notes: DayNote[];
  onSaveNote: (date: string, note: string) => void;
  onDeleteNote: (date: string) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  days,
  notes,
  onSaveNote,
  onDeleteNote
}) => {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [noteText, setNoteText] = useState('');

  const openNoteModal = (date: Date, existingNote?: string) => {
    const dateString = formatDate(date);
    setSelectedDate(dateString);
    setNoteText(existingNote || '');
    setShowNoteModal(true);
  };

  const closeNoteModal = () => {
    setShowNoteModal(false);
    setSelectedDate('');
    setNoteText('');
  };

  const saveNote = () => {
    if (noteText.trim()) {
      onSaveNote(selectedDate, noteText.trim());
    } else {
      onDeleteNote(selectedDate);
    }
    closeNoteModal();
  };

  const getDayNote = (dateString: string) => {
    return notes.find(note => note.date === dateString);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar size={20} />
        Daily Reflections
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {days.slice(0, 21).map((day) => { // Show first 21 days to avoid overcrowding
          const dateString = formatDate(day);
          const dayNote = getDayNote(dateString);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={dateString}
              className={`p-3 rounded-lg border-2 border-dashed border-gray-200 cursor-pointer hover:border-primary-300 transition-colors ${
                isCurrentDay ? 'ring-2 ring-primary-200 bg-primary-50' : ''
              } ${dayNote ? 'border-primary-200 bg-primary-25' : ''}`}
              onClick={() => openNoteModal(day, dayNote?.note)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">
                  {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {isCurrentDay && <span className="ml-1 text-primary-600">(Today)</span>}
                </span>
                {dayNote ? (
                  <Edit3 size={14} className="text-primary-600" />
                ) : (
                  <Plus size={14} className="text-gray-400" />
                )}
              </div>
              {dayNote ? (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {dayNote.note}
                </p>
              ) : (
                <p className="text-xs text-gray-400">Add a reflection...</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-scale-up">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                Reflection for {parseDate(selectedDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <button
                onClick={closeNoteModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="How did today go? Any insights, wins, or challenges?"
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
            </div>
            <div className="flex gap-2 p-4 border-t">
              <button
                onClick={saveNote}
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={closeNoteModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};