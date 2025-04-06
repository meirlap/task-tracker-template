import React from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

const TaskHistoryList = ({ tasks, excludeDate }) => {
  const today = new Date().toISOString().split('T')[0];

  const filtered = tasks
    .filter(task => task.date !== excludeDate && new Date(task.date) <= new Date(today))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5); // הצג עד 5 ימים אחרונים כולל היום

  if (filtered.length === 0) {
    return (
      <Typography variant="body2" sx={{ mt: 2 }}>
        אין היסטוריית משימות זמינה.
      </Typography>
    );
  }

  return (
    <List sx={{ mt: 2 }}>
      {filtered.map(task => (
        <React.Fragment key={task.task_id}>
          <ListItem alignItems="flex-start">
            <ListItemText
              primary={`🗓️ ${task.date} - ${task.description}`}
              secondary={
                <>
                  <Typography component="span" variant="body2">
                    בוצע: {task.completed ? '✔️ כן' : '❌ לא'}
                  </Typography>
                  <br />
                  {task.completed === false && task.reason_not_completed && (
                    <>
                      סיבה: {task.reason_not_completed}
                      <br />
                    </>
                  )}
                  {task.completed && task.allergy_reaction !== null && (
                    <>
                      תגובה אלרגית: {task.allergy_reaction}
                      <br />
                    </>
                  )}
                  {task.notes && `הערות: ${task.notes}`}
                </>
              }
            />
          </ListItem>
          <Divider component="li" />
        </React.Fragment>
      ))}
    </List>
  );
};

export default TaskHistoryList;
