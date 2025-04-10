import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Button, Box, Collapse
} from '@mui/material';
import { getTasksForPatient } from '../../utils/api';
import TodayTaskForm from '../TodayTaskForm';
import TaskHistoryList from '../TaskHistoryList';

const PatientView = ({ patient }) => {
  const [tasks, setTasks] = useState([]);
  const [showTodayForm, setShowTodayForm] = useState(false);
  const [showHistory, setShowHistory] = useState(true); // ✅ פתוח כברירת מחדל

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasksForPatient(patient.id, 30);
        setTasks(data);
      } catch (err) {
        console.error('שגיאה בטעינת משימות למטופל:', err);
      }
    };

    if (patient?.id) fetchTasks();
  }, [patient]);

  const toggleTodayForm = () => {
    setShowTodayForm(prev => !prev);
  };

  const toggleHistory = () => {
    setShowHistory(prev => !prev);
  };

  const updateTaskInState = (updatedTask) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const todayTask = tasks.find(task => task.date === todayStr);

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">{patient.full_name}</Typography>

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
              <TodayTaskForm
                task={todayTask}
                patientName={patient.full_name}
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
