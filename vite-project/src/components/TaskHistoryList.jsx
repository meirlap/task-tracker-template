import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from '@mui/material';

const formatDisplayDate = (isoStr) => {
  const [year, month, day] = isoStr.split('-');
  return `${day}/${month}/${year.slice(2)}`;
};

const TaskHistoryList = ({ tasks, excludeDate }) => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return <Typography>אין משימות להצגה</Typography>;
  }

  const filtered = tasks
    .filter(t => t.date !== excludeDate && new Date(t.date) <= new Date())
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10); // 🔟 רק 10 אחרונים

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="task history table">
        <TableHead>
          <TableRow>
            <TableCell>תאריך</TableCell>
            <TableCell>תיאור</TableCell>
            <TableCell>סטטוס</TableCell>
            <TableCell>תגובה אלרגית</TableCell>
            <TableCell>סיבה</TableCell>
            <TableCell>הערות</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{formatDisplayDate(task.date)}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{task.completed ? '✔️ בוצע' : '❌ לא בוצע'}</TableCell>
              <TableCell>{task.completed && task.allergy_reaction !== null ? task.allergy_reaction : ''}</TableCell>
              <TableCell>{!task.completed && task.reason_not_completed ? task.reason_not_completed : ''}</TableCell>
              <TableCell>{task.notes || ''}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskHistoryList;
