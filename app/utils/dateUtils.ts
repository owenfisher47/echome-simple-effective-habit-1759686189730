export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00');
};

export const getDaysInMonth = (year: number, month: number): Date[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days: Date[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month - 1, day));
  }
  
  return days;
};

export const getCurrentMonth = (): { year: number; month: number } => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1
  };
};

export const getMonthName = (month: number): string => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[month - 1];
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isFutureDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date > today;
};