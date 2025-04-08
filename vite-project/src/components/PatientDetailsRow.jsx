import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button
} from '@mui/material';
import TaskCalendar from './TaskCalendar';
import TaskHistoryList from './TaskHistoryList';
import { replaceTasksFromDate } from '../utils/api';
import { useTranslation } from 'react-i18next';

const formatLocalDate = (d) => {
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().split('T')[0];
};

const formatDisplayDate = (isoStr) => {
  const [year, month, day] = isoStr.split('-');
  return `${day}/${month}/${year.slice(2)}`;
};

const PatientDetailsRow = ({ patient, tasks, refreshTasks }) => {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === 'he';

  const [selectedDate, setSelectedDate] = useState(null);
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');

  const today = formatLocalDate(new Date());

  const getLatestFutureTaskDate = () => {
    const futureTasks = tasks.filter(t => new Date(t.date) >= new Date(selectedDate));
    if (futureTasks.length === 0) return selectedDate;
    const latest = futureTasks.reduce((max, t) =>
      new Date(t.date) > new Date(max.date) ? t : max
    );
    return latest.date;
  };

  useEffect(() => {
    if (selectedDate) {
      const task = tasks.find(t => t.date === selectedDate);
      setDescription(task?.description || '');
      const existingEnd = getLatestFutureTaskDate();
      setEndDate(existingEnd);
    }
  }, [selectedDate]);

  const handleReplaceTasks = async () => {
    try {
      await replaceTasksFromDate({
        patient_id: patient.id,
        description,
        start_date: selectedDate,
        end_date: endDate
      });
      await refreshTasks();
      setDescription('');
      setEndDate('');
    } catch (err) {
      console.error("❌ Failed to replace tasks", err);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: '#f5f5f5',
        borderRadius: 2,
        mt: 1,
        display: 'flex',
        flexDirection: { xs: 'column', md: isRTL ? 'row-reverse' : 'row' },
        gap: 2,
        direction: isRTL ? 'rtl' : 'ltr',
        width: '100%',
      }}
    >
      {/* יומן ומשימות נוכחיות */}
      <Box sx={{ flex: 1, minWidth: 360, maxWidth: 420 }}>
        <Typography variant="h6" gutterBottom>
          {t('dashboard.tasks_title', { name: patient.name })}
        </Typography>

        <TaskCalendar
          tasks={tasks}
          onDateSelect={(dateStr) => {
            setSelectedDate(dateStr);
          }}
        />

        {selectedDate && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">
              {formatDisplayDate(selectedDate)} -{' '}
              {new Date(selectedDate) < new Date() ? t('task.answer') + " " + t('task.completed') : t('task.answer')}
            </Typography>

            {new Date(selectedDate) < new Date() ? (
              (() => {
                const tsk = tasks.find(t => t.date === selectedDate);
                return tsk ? (
                  <Box sx={{ mt: 1 }}>
                    <Typography>{t('task.task')}: {tsk.description}</Typography>
                    <Typography>
                      {t('task.completed')}: {tsk.completed ? '✔️' : '❌'}
                    </Typography>
                    {tsk.completed && tsk.allergy_reaction !== null && (
                      <Typography>{t('task.allergy_reaction')}: {tsk.allergy_reaction}</Typography>
                    )}
                    {!tsk.completed && tsk.reason_not_completed && (
                      <Typography>{t('task.reason_not_completed')}: {tsk.reason_not_completed}</Typography>
                    )}
                    {tsk.notes && (
                      <Typography>{t('task.notes')}: {tsk.notes}</Typography>
                    )}
                  </Box>
                ) : (
                  <Typography>{t('task.today_task')} לא זמין לתאריך זה.</Typography>
                );
              })()
            ) : (
              <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                <TextField
                  label={t('task.task')}
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                  label={t('dashboard.date')}
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={handleReplaceTasks}
                >
                  {tasks.find(t => t.date === selectedDate) ? t('task.update_tasks') : t('task.create_tasks')}
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* היסטוריית משימות */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          {t('task.task_history', { defaultValue: "היסטוריית משימות" })}
        </Typography>
        <TaskHistoryList tasks={tasks} excludeDate={today} />
      </Box>
    </Box>
  );
};

export default PatientDetailsRow;
