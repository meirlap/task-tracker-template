import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import TodayTaskForm from '../TodayTaskForm';
import TaskHistoryList from '../TaskHistoryList';
import TaskList from './TaskList';

const PatientView = ({ patient }) => {
  const [tasks, setTasks] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (patient?.tasks) {
      setTasks(patient.tasks);
    }
  }, [patient]);

  const handleTaskUpdate = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const today = new Date().toISOString().split('T')[0];
  const todayTask = tasks.find((task) => task.date === today);

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        👤 {patient.full_name}
      </Typography>

      {todayTask ? (
        <TaskList
          patient={{ ...patient, tasks }}
          updateTaskInList={handleTaskUpdate}
        />
      ) : (
        <Typography variant="body1" sx={{ mb: 2 }}>
          אין משימה זמינה להיום.
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      <Typography
        variant="body2"
        sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'primary.main' }}
        onClick={() => setShowHistory(!showHistory)}
      >
        {showHistory ? 'הסתר היסטוריית משימות' : 'הצג היסטוריית משימות'}
      </Typography>

      {showHistory && (
        <TaskHistoryList tasks={tasks} excludeDate={today} />
      )}
    </Paper>
  );
};

export default PatientView;
