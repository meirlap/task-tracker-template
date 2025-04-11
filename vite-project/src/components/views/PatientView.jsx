import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Button, Box, Collapse
} from '@mui/material';
import { getUserRole, getTasksForPatient } from '../../utils/api';
import TodayTaskFormParent from '../TodayTaskFormParent';
import TaskHistoryList from '../TaskHistoryList';

const PatientView = ({ userEmail, patientId, fullName }) => {
  const [tasks, setTasks] = useState([]);
  const [todayTask, setTodayTask] = useState(null);
  const [showTodayForm, setShowTodayForm] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (patientId) {
          const taskList = await getTasksForPatient(patientId, 30);
          setTasks(taskList);
          const today = new Date().toISOString().split('T')[0];
          const todayTask = taskList.find(task => task.date === today);
          setTodayTask(todayTask);
        }
      } catch (err) {
        console.error('Failed to fetch patient tasks:', err);
      }
    };

    fetchTasks();
  }, [userEmail, patientId]);

  const toggleTodayForm = () => {
    setShowTodayForm(prev => !prev);
  };

  const toggleHistory = () => {
    setShowHistory(prev => !prev);
  };

  const updateTaskInState = (updatedTask) => {
    setTasks(prev =>
      prev.map(task => task.id === updatedTask.id ? updatedTask : task)
    );
    setTodayTask(updatedTask);
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">שלום {fullName}</Typography>

          {todayTask && (
            <Typography sx={{ mt: 1 }}>
              📝 {todayTask.description}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            {todayTask && (
              <Button
                variant="outlined"
                onClick={toggleTodayForm}
              >
                {showTodayForm ? 'סגור מענה' : 'ענה למשימה'}
              </Button>
            )}

            <Button
              variant="outlined"
              onClick={toggleHistory}
            >
              {showHistory ? 'הסתר היסטוריה' : 'הצג היסטוריה'}
            </Button>
          </Box>

          {todayTask && (
            <Collapse in={showTodayForm}>
              <TodayTaskFormParent
                task={todayTask}
                patientId={patientId}
                defaultDate={new Date(todayTask.date)}
                patientName={fullName}
                onSubmitSuccess={updateTaskInState}
                onClose={toggleTodayForm}
              />
            </Collapse>
          )}

          <Collapse in={showHistory}>
            <TaskHistoryList tasks={tasks} />
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PatientView;
