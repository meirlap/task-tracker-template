import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const toLocalIsoDate = (dateObj) => {
  const offset = dateObj.getTimezoneOffset();
  const localDate = new Date(dateObj.getTime() - offset * 60000);
  return localDate.toISOString().split('T')[0];
};

const TaskCalendar = ({ tasks, onDateSelect }) => {
  const taskDates = tasks.reduce((acc, t) => {
    acc[t.date] = t.completed ? 'green' : 'red';
    return acc;
  }, {});

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const key = toLocalIsoDate(date);
      return taskDates[key] === 'green'
        ? 'tile-complete'
        : taskDates[key] === 'red'
        ? 'tile-missing'
        : null;
    }
  };

  return (
    <>
      <Calendar
        tileClassName={tileClassName}
        locale="he-IL"
        onClickDay={(value) => {
          const clicked = toLocalIsoDate(value);
          onDateSelect(clicked);
        }}
      />
      <style>
        {`
          .tile-complete { background-color: #c8e6c9 !important; }
          .tile-missing { background-color: #ffcdd2 !important; }
        `}
      </style>
    </>
  );
};

export default TaskCalendar;
